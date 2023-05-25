const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const TableService = require("./tables.service");
const ReservationService = require("../reservations/reservations.service");




const tableExists = async(req, res, next) => {
    const { tableId } = req.params;
    const table = await TableService.read(tableId);
    if(!table){
        return next({
            status: 404,
            message: `Table: ${tableId} not found.`
        })
    }
    res.locals.table = table;
    next();
}

const tableNameIsValid = (req, res, next) => {
    const { data: {table_name} } = req.body;
    if(!table_name || table_name.length <= 1){
        return next({
            status:400,
            message: 'table_name is missing'
        })
    }
    next();
  }
const tableIsValid = (req, res, next) => {
    const newTable = req.body.data;
    if(!newTable) {
        return next({
            status:400,
            message: "table is missing"
        });
    }
    next();
}

  const tableEntriesAreValid = async(req, res, next) => {
      const {data: {reservation_id}} = req.body;
      if (!req.body.data || !reservation_id){
      return next({
        status: 400,
        message: `No data or no reservation_id sent.`,
      });
      }
    const reservationId = await ReservationService.read(reservation_id);
    if (!reservationId)
      return next({
        status: 404,
        message: `${reservation_id} not found`,
      });
      if(reservationId.status === "seated"){
          return next({
              status:400,
              message: `${reservationId} already seated`
          })
      }
   
    res.locals.reservation = reservationId;
    next();
  }

  const availableTable = async(req, res, next) => {
    const { tableId } = req.params;
    const table = await TableService.read(tableId);
    const reserved = res.locals.reservation;
      if(table.occupied || reserved.people > table.capacity){
          return next({
              status: 400,
              message: "Table is occupied or reservation has surpassed capacity"
          })
      }
      next();
  }

const capacityIsValid = (req,res, next) => {
      const { data: {capacity} } = req.body;
      if(!capacity) {
        return next({
            status:400,
            message: 'capacity is missing'
        })
      }
      next();
  }

async function read(req, res) {
    const { table } = res.locals;
    res.json({data: table})
}

async function list(req,res){
    const data = await TableService.list();
    res.status(200).json({data})
}

async function create(req, res, next) {
    const newTable = await TableService.create(req.body.data);
    
    if(!newTable) {
        return next({
            status:400,
            message:"data is missing"
        })
    }
    res.status(201).json({ data: newTable });
}

const update = async(req, res) => {
    const { tableId } = req.params;
    const { reservation_id } = req.body.data
    const  updatedTable = await TableService.update(tableId, reservation_id);
    
    await ReservationService.updateStatus(reservation_id, "seated");
    res.status(200).json({ data: updatedTable})
}

const clearTable = async(req, res, next) => {
    const { table } = res.locals;
    const { tableId } = req.params;
    
    if(!table.occupied){
        return next({ status:400, message: `Table ${table.table_name} not occupied.` })
    }

    const clearedTable = await TableService.clearTable(tableId);
    await ReservationService.updateStatus(table.reservation_id, "finished")
    
    res.status(200).json({ data: clearedTable });
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    create: [asyncErrorBoundary(tableIsValid),
            asyncErrorBoundary(capacityIsValid),
            asyncErrorBoundary(tableNameIsValid),
            asyncErrorBoundary(create)],
    update: [asyncErrorBoundary(tableIsValid),
             asyncErrorBoundary(tableEntriesAreValid), 
             asyncErrorBoundary(availableTable), 
             asyncErrorBoundary(update)],
    read: [asyncErrorBoundary(tableExists), 
           asyncErrorBoundary(read)],
    delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(clearTable)]
}
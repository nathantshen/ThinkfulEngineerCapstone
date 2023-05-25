const knex = require("../db/connection");

const list = () => {
    return knex("tables")
    .select("*")
    .orderBy("table_name");
}

const read = (table_id) => {
    return knex("tables")
        .select()
        .where('table_id', table_id )
        .first();
}

const create = (table) => {
    return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdTable) => createdTable[0]);
}

const update= (tableId, reservation_id) => {
    return knex("tables")
    .where("table_id", tableId)
    .update({reservation_id: reservation_id, occupied: true}, "*");
}

const clearTable = (tableId) => {
    return knex("tables")
    .where("table_id", tableId)
    .update({reservation_id: null, occupied: false})
    .returning("*")
}

module.exports = {
    list,
    create,
    update,
    read,
    clearTable,
}
const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

// Validation Middleware
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservationId} not found`,
  })
}

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "Body must have data property."
  })
}   

function hasFirstName(req, res, next) {
  const name = req.body.data.first_name;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: "first_name property required.",
  })
}

function hasLastName(req, res, next) {
  const name = req.body.data.last_name;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: "last_name property required.",
  })
}

function validStatus(req, res, next) {
  const status = req.body.data.status;
  if (status !== 'seated' && status !== 'finished') {
    return next();
  }
  next({
    status: 400,
    message: "status cannot be seated, finished.",
  })
}

function hasMobileNumber(req, res, next) {
  const phone = req.body.data.mobile_number;
  if (phone) {
    return next();
  }
  next({
    status: 400,
    message: "mobile_number property required.",
  })
}

function hasReservationDate(req, res, next) {
  const date = req.body.data.reservation_date;
  if (date) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date property required.",
  })
}

function validDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const valid = Date.parse(date);

  if (valid) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date must be valid date.",
  })
}

function noTuesday(req, res, next) {
  const date = req.body.data.reservation_date;
  const weekday = new Date(date).getUTCDay();
  if (weekday !== 2) {
    return next();
  }
  next({
    status: 400,
    message: "Restaurant is closed on Tuesdays.",
  })
}

function noPastReservations(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const now = Date.now();
  const proposedReservation = new Date(`${reservation_date} ${reservation_time}`).valueOf();

  if (proposedReservation > now) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must be in future.",
  })
}

function hasReservationTime(req, res, next) {
  const time = req.body.data.reservation_time;
  if (time && typeof time === 'string') {
    return next();
  }
  next({
    status: 400,
    message: "valid reservation_time property required.",
  })
}

function validTime(req, res, next) {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  const time = req.body.data.reservation_time;
  const valid = time.match(regex);
  if (valid) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_time must be valid time.",
  })
}

function reservationDuringHours(req, res, next) {
  const time = req.body.data.reservation_time;
  const open = "10:30";
  const close = "21:30";
  if (time >= open && time <= close) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must be between 10:30AM and 9:30PM.",
  })
}

function hasValidPeople(req, res, next) {
  const people = req.body.data.people;
  
  if (people > 0 && typeof people === 'number') {
    return next();
  }
  next({
    status: 400,
    message: "valid people property required"
  })
}

function updateValidStatus(req, res, next) {
  const status = req.body.data.status;
  if (status !== 'unknown') {
    return next();
  }
  next({
    status: 400,
    message: "status cannot be unknown.",
  })
}

function notFinished(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status === 'finished') {
    next({
      status: 400,
      message: "reservation cannot already be finished.",
    })  
  } else {
    return next();
  }
}


/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date, currentDate, mobile_number } = req.query;
  if (date) {
    const data = await service.listByDate(date);
    res.json({ data });
  } else if (currentDate) {
    const data = await service.listByDate(currentDate);
    res.json({ data });
  } else if (mobile_number) {
    const data = await service.listByPhone(mobile_number);
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

async function create(req, res) {
  const reservation = req.body.data;
  const data = await service.create(reservation);
  res.status(201).json({ data });
}

async function updateReservation(req, res) {
  const reservation = req.body.data;
  const newRes = await service.updateReservation(reservation);
  const result = newRes[0];
  res.status(200).json({ data: result });
}

async function updateStatus(req, res) {
  const status = req.body.data.status;
  const reservation = res.locals.reservation;
  let result = await service.updateStatus(reservation.reservation_id, status);
  res.status(200).json({ data: { status: result[0].status } })
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData, 
    hasFirstName, 
    hasLastName, 
    hasMobileNumber, 
    hasReservationDate,
    validDate,
    validStatus,
    noTuesday,
    hasReservationTime,
    validTime,
    reservationDuringHours,
    noPastReservations,
    hasValidPeople, 
    asyncErrorBoundary(create)
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasFirstName,
    hasLastName, 
    hasMobileNumber, 
    hasReservationDate,
    validDate,
    validStatus,
    noTuesday,
    hasReservationTime,
    validTime,
    reservationDuringHours,
    hasValidPeople, 
    asyncErrorBoundary(updateReservation),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists), 
    notFinished,
    updateValidStatus,
    asyncErrorBoundary(updateStatus),
  ]
};

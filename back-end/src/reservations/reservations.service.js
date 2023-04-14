const { KnexTimeoutError } = require('knex');
const knex = require('../db/connection');

function list() {
  return knex('reservations')
    .select('*')
    .whereNot({ status: "finished"})
    .andWhereNot({ status: "cancelled"})
    .orderBy('reservation_time');
}

function listByDate(reservation_date) {
  return knex('reservations')
    .select('*')
    .where({ reservation_date })
    .whereNot({ status: "finished"})
    .andWhereNot({ status: "cancelled"})
    .orderBy('reservation_time')
}

function listByPhone(mobile_number) {
  return knex('reservations')
    .select('*')
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_id");
}

function read(reservation_id) {
  return knex('reservations')
    .select('*')
    .where({ reservation_id })
    .then((result) => result[0]);
}

function create(newReservation) {
  return knex('reservations')
    .insert({
      ...newReservation,
      "status": "booked",
    })
    .returning('*')
    .then((result) => result[0]);
}

async function updateStatus(reservation_id, status) {
  return knex('reservations')
    .where({ reservation_id })
    .update({status: status }, '*')
}

async function updateReservation(reservation) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = reservation;
  return knex('reservations')
    .where({ reservation_id })
    .update({
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      reservation_date: reservation_date,
      reservation_time: reservation_time,
      people: people,
    }, [
      'first_name',
      'last_name',
      'mobile_number',
      'people',
      'reservation_date',
      'reservation_time',
    ])
  
}

module.exports = {
  list,
  listByDate,
  listByPhone,
  read,
  create,
  updateStatus,
  updateReservation,
}
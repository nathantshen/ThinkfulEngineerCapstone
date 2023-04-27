const knex = require("../db/connection");

const tableName = "reservations";

function list() {
  return knex(tableName).select("*").orderBy("reservation_time", "asc");
}

function listOnDate(reservation_date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date })
    .whereNotIn("status", ["finished", "cancelled"])
    .orderBy("reservation_time", "asc");
}

function listForNumber(mobile_number) {
  return knex(tableName)
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function create(reservation) {
  return knex(tableName)
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex(tableName)
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function update(reservation) {
  return knex(tableName)
    .select("*")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation)
    .then(() => read(reservation.reservation_id));
}

module.exports = {
  create,
  list,
  listOnDate,
  listForNumber,
  read,
  update,
};

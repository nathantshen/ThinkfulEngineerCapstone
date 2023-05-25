const knex = require("../db/connection");



function list(date) {
    return knex("reservations")
    .select("*")
    .where({reservation_date: date})
    .whereNotIn("status", ["finished"])
    .orderBy("reservation_time", "asc");
}

function listByMobileNum(mobile_number) {
    return knex("reservations")
    .select("*")
    .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
    .orderBy("reservation_time")
}

const read = (id) => 
     knex("reservations")
    .select()
    .where({reservation_id: id})
    .first()

function create(reservation) {
    return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0])
}

function update(id, updatedReservation) {
    return knex("reservations")
    .where({reservation_id: id})
    .update(updatedReservation)
    .returning(['first_name', 'last_name', 'mobile_number', 'people', 'reservation_date', 'reservation_time'])
}

function updateStatus(id, status) {
    return knex("reservations")
    .where("reservation_id", id)
    .update({status: status})
    .returning("status")
}

module.exports = {
    list,
    listByMobileNum,
    create,
    read,
    update,
    updateStatus
};
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom"
import { cancelReservation } from "../utils/api";
import { formatDate, formatTime } from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert"


export default function Reservations({ reservation }) {
  const date = formatDate(reservation.reservation_date)
  const [reservationsError, setReservationsError] = useState(null)
  const history = useHistory();
  const cancelHandler = async(event) => {
    try{
      if(window.confirm("Do you want to cancel this reservation?")){
        await cancelReservation(reservation.reservation_id);
        history.go(0);
      } 
    } catch(error) {
      setReservationsError(error)
    }
  }
  if(reservation.status === 'cancelled') { 
    return null;
  }
  const time = formatTime(reservation.reservation_time)

    return (
      <div className='card text-center text-dark bg-warning ml-2' style={{maxWidth: "18rem"}}>
        <ErrorAlert error={reservationsError} />
        <div className="card-body">
          <h5 className="card-title ">{reservation.first_name} {reservation.last_name}</h5>
          <p className="card-text">Mobile Number - <span className="oi oi-phone"></span> {reservation.mobile_number}</p>
          <p className="card-text">Date - <span className="oi oi-calendar"/> {date} </p>
          <p className="card-text">Time - <span className="oi oi-clock" /> {time} </p>
          <p className="card-text">Party Size - <span className="oi oi-people"></span> {reservation.people} </p>
          <p className="card-text fw-bolder" data-reservation-id-status={reservation.reservation_id}>{reservation.status}</p>
          {reservation.status=== "seated" ? null :
            <Link to={`/reservations/${reservation.reservation_id}/seat`} className="btn btn-success oi oi-arrow-thick-bottom"> Seat </Link>
          }
          <Link to={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-secondary ml-1 oi oi-pencil"> Edit</Link>
          <button data-reservation-id-cancel={reservation.reservation_id} onClick={cancelHandler} className="btn btn-danger ml-1 oi oi-trash"> Cancel</button>
        </div>
      </div>
    )
}
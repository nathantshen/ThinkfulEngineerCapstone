import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getReservation, updateReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationEdit({ date }) {
  const { reservation_id } = useParams();
  const [currentReservation, setCurrentReservation] = useState({reservation_id});
  const [error, setError] = useState(null);
  const history = useHistory();
  
  useEffect(() => {
    getReservation(reservation_id)
    .then((response) => {
      setCurrentReservation({
        ...response,
        people: Number(response.people),
      })
    })
    .catch(setError);
  }, [reservation_id]);

  
  
  const handleChange = ({ target }) => {
    setCurrentReservation({
      ...currentReservation,
      [target.name]: target.value,
    })
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    updateReservation({
      ...currentReservation,
      people: Number(currentReservation.people),
    })
    .then((response) => {
      setCurrentReservation({...response})
      history.push(`/dashboard?date=${currentReservation.reservation_date}`)
    })
    
    .catch(setError)
  }

  return (
    <>
      <h1> Edit Reservation: {reservation_id} </h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className="form-group">
        <div className="row mb-3">
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="first_name">
              First Name
            </label>
            <input
              className="form-control"
              id="first_name"
              name="first_name"
              type="text"
              onChange={handleChange}
              required={true}
              placeholder={currentReservation.first_name}
              value={currentReservation.first_name}
              
            />
            <small className="form-text text-muted"> Enter First Name </small>
          </div>
          <div className="col-4">
            <label className="form-label" htmlFor="last_name">
              Last Name
            </label>
            <input
              className="form-control"
              id="last_name"
              name="last_name"
              type="text"
              onChange={handleChange}
              required={true}
              placeholder={currentReservation.last_name}
              value={currentReservation.last_name}
            />
            <small className="form-text text-muted"> Enter Last Name </small>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="mobile_number">
              Mobile Number
            </label>
            <input
              className="form-control"
              id="mobile_number"
              name="mobile_number"
              type="text"
              onChange={handleChange}
              required={true}
              placeholder={currentReservation.mobile_number}
              value={currentReservation.mobile_number}
            />
            <small className="form-text text-muted"> Enter Mobile Number </small>
          </div>
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="mobile_number">
              Party Size
            </label>
            <input
              className="form-control"
              id="people"
              name="people"
              type="number"
              onChange={handleChange}
              required={true}
              placeholder={currentReservation.people}
              value={currentReservation.people}
            />
            <small className="form-text text-muted"> Enter Party Size </small>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-4 form-group"> 
          <label>
            Reservation Date
          </label>
          <input
            className="form-control"
            id="reservation_date"
            name="reservation_date"
            type="date"
            onChange={handleChange}
            required={true}
            placeholder={currentReservation.reservation_date}
            value={currentReservation.reservation_date}
          />
          <small className="form-text text-muted"> Enter Reservation Date (Closed on Tuesdays) </small>
          </div>
          <div className="col-4 form-group"> 
          <label>
            Reservation Time
          </label>
          <input
            className="form-control"
            id="reservation_time"
            name="reservation_time"
            type="time"
            onChange={handleChange}
            required={true}
            placeholder={currentReservation.reservation_time}
            value={currentReservation.reservation_time}
          />
          <small className="form-text text-muted"> Enter Reservation Time </small>
          </div> 
        </div>
        <button type="button" className="btn btn-secondary mr-2" onClick={() => history.goBack()}> Cancel </button>
        <button type="submit" className="btn btn-primary"> Submit Edit </button>
        
      </form>
    </>
  )
}

export default ReservationEdit;
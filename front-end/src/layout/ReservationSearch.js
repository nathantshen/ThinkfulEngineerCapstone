import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";

import ReservationDetail from "./reservations/ReservationDetail";

function ReservationSearch() {
  const [mobile_number, setMobile_number] = useState('');
  const [reservations, setReservations] = useState(null);
  const history = useHistory();
  const [error, setError] = useState('No reservations found');

  const handleSubmit = (event) => {
      event.preventDefault();
      setError(null);
      listReservations({mobile_number})
      .then((response) => {
        setReservations(response)
        history.push('/search')
      })
      .catch(setError('No reservations found'))
  }

  return (
    <>
      <div className="mb-3">
          <h1> Find Reservation </h1>
      </div>
      
      <form className="form-group mb-3" onSubmit={handleSubmit}>
        <input
          type="search"
          name="mobile_number"
          className="form-control rounded mb-2"
          placeholder="Enter a customer's phone number"
          onChange={(event) => setMobile_number(event.target.value)}
          value={mobile_number}
        />
        <div>
          <button type="submit" className="btn btn-primary"> find </button>
        </div>
      </form>
      <br />
      {reservations && reservations.length ?
      <div>
        <h3 className="mb-3"> Matching Reservations </h3>
        <table className="table table-striped">
          <thead>
            <th scope="col"> Reservation ID </th>
            <th scope="col"> First Name </th>
            <th scope="col"> Last Name </th>
            <th scope="col"> Party Size </th>
            <th scope="col"> Phone Number </th>
            <th scope="col"> Reservation Date </th>
            <th scope="col"> Reservation Time </th>
            <th scope="col"> Reservation Status </th>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <ReservationDetail res={res} />
            ))}
          </tbody>
        </table>
      </div>
      :
      <>
        <p className="alert alert-danger"> {error} </p>
      </>
      }
    </>
  );
}

export default ReservationSearch;
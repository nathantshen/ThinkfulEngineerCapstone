import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../Reservations/Reservations";

const formatNumber = mobile_phone => {
  mobile_phone = mobile_phone.toString();
  const areaCode = mobile_phone.slice(0,3);
  const firstPortion = mobile_phone.slice(3,6);
  const secondPortion = mobile_phone.slice(6,10);
  return areaCode + "-" + firstPortion + "-" + secondPortion;
};

export default function Search() {

    const [ mobile_phone, setMobile_phone ] = useState("")
    const [ data, setData ] = useState([]);
    const [ searchError, setSearchError ] = useState(null);
    const [ buttonDisable, setButtonDisable ] = useState(false);

    const findHandler = event => {
        event.preventDefault();
        if(mobile_phone !== ""){
        const controller = new AbortController()
        setButtonDisable(state => !state)
        const mobile_number = formatNumber(mobile_phone)
        listReservations({ mobile_number }, controller.signal)
        .then(setData)
        .catch(setSearchError)
        setButtonDisable(state => !state);}
    }

  return (
    <div>
    <h1>Search</h1>
      <ErrorAlert error={searchError} />
      <form className="d-flex" onSubmit={findHandler}>
        <div className="form-group mb-2 mr-1 col-6">
          <input
            type="number"

            className="form-control"
            name="mobile_number"
            id="mobile_number"
            placeholder="Enter a customer's phone number"
            value={mobile_phone}
            onChange={event => setMobile_phone(event.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-info mb-2 ml-1"
          disabled={buttonDisable}
        >
          Find
        </button>
      </form>
      {data.length > 0 ? <Reservation reservations={data} /> : <h3>No reservations found</h3>}
    </div>
  );
};
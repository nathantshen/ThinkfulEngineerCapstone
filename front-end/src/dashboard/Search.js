import React, {  useState } from "react"
import Reservations from "./Reservations";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert"

export default function Search(){
    const [mobileNumber, setMobileNumber] = useState(0);
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    const formChange = ({ target }) => {
        setMobileNumber({...mobileNumber, [target.name]: target.value});
    }

    const handleSearch = async(event) => {
        event.preventDefault();
      
        const abortController = new AbortController();
       
           const reservationByNum = await listReservations(mobileNumber, abortController.signal)
           setReservations(reservationByNum)
           if(reservationByNum.length === 0){
               setReservationsError({message: "No reservations found"})
           } else {
               setReservationsError(null)
           }
    }

    return (
        <>
        <h1 className="text-center">Search For Reservation</h1>
        <ErrorAlert error={reservationsError} />
        <div className="d-flex flex-column align-items-center">
            <form onSubmit={handleSearch} className="mt-5 text-center" style={{width: "48rem"}}>
                <input 
                    className="form-control"
                    name="mobile_number"
                    placeholder="Search by customer's phone number"
                    onChange={formChange}
                    required
                />
                <button className="mt-2 oi oi-magnifying-glass" type="submit"> Find </button>
            </form>
        </div>
        {!reservations ? null :
            reservations.map((reservation) => (
          <Reservations className="mt-5" key={reservation.reservation_id} reservation={reservation} />
        ))
        }
        </>
    )
}
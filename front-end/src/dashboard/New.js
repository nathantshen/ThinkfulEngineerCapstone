import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createReservation } from "../utils/api";
import ErrorAlert  from "../layout/ErrorAlert"
import ReservationForm from "./ReservationForm"

export default function New() {
    const history = useHistory();
    const initialState = {
                            first_name: "", 
                            last_name: "", 
                            mobile_number: "", 
                            reservation_date: "", 
                            reservation_time:"", 
                            people:"" 
                        };
    const [newReservation, setNewReservation] = useState({...initialState})
    const [reservationsError, setReservationsError] = useState(null)

    const formChange = ({ target }) => {
        setNewReservation({...newReservation, [target.name]: target.value});
    }

    const peopleFormChange = ({ target }) => {
        setNewReservation({...newReservation, [target.name]: parseInt(target.value,10) });
    }

    const formSubmit = async (event) => {
        event.preventDefault();
        setNewReservation({...newReservation});
        try {
            await createReservation(newReservation)
            history.push(`/dashboard?date=${newReservation.reservation_date}`)
        }catch (err){
            setReservationsError(err)
        }
    }

    return (
    <>
    <h1 className="m-3 text-center"> Create Reservation </h1>
    <ErrorAlert error={reservationsError} />

        <ReservationForm 
            formChange={formChange} 
            peopleFormChange={peopleFormChange} 
            formSubmit={formSubmit} 
            reservation={newReservation} />
    </>)
}
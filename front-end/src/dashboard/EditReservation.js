import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import formatReservationDate from "../utils/format-reservation-date";
import ReservationForm from "./ReservationForm";



export default function EditReservation(){
   const history = useHistory();
   const {reservation_id} = useParams();
   const [oldReservation, setOldReservation] = useState({})
   const [reservationsError, setReservationsError] = useState(null)
   useEffect(() => {
       const getReservation = async() => {
           const abortController = new AbortController();
            const response = await readReservation(reservation_id, abortController.signal);
            if(response){
                 const reservation = formatReservationDate(response)
                 setOldReservation(reservation);
            }
       }
       getReservation();
   }, [reservation_id]);
   
   const peopleFormChange = ({ target }) => {
    setOldReservation({...oldReservation, [target.name]: parseInt(target.value,10) });
}
    const formChange = ({ target }) => {
        setOldReservation({...oldReservation, [target.name]: target.value});
    }
    const formSubmit = async(event) => {
        event.preventDefault();
        setOldReservation({...oldReservation});
        try {
            await updateReservation(reservation_id , oldReservation)
            
            history.push(`/dashboard?date=${oldReservation.reservation_date}`)
        }catch (err){
            setReservationsError(err)
        }
    }
   
   return (
       <>
       <h2>Edit Reservation</h2>
       <ErrorAlert error={reservationsError} />
       <ReservationForm reservation={oldReservation} formChange={formChange} formSubmit={formSubmit} peopleFormChange={peopleFormChange} />
       </>
   )
}
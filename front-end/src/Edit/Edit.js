import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import NewReservation from "../Reservations/NewReservation";

export default function Edit() {
    
    const { reservation_id } = useParams();
    const [ reservation, setReservation ] = useState(null);
    const [ resError, setResError ] = useState(null);

    const loadReservation = () => {
        const controller = new AbortController();
        readReservation(reservation_id, controller.signal)
        .then(setReservation)
        .catch(setResError);
        return () => controller.abort();
    };

    useEffect(loadReservation, [reservation_id])

    return(
        <div>
            <ErrorAlert error={resError} />
            {reservation ? <NewReservation reservation={reservation} /> : <p>Loading...</p>}
        </div>
    )
}
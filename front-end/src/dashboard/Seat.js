import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import { listTables, readReservation, updateTable } from "../utils/api"
import ErrorAlert  from "../layout/ErrorAlert"
import Reservations from "./Reservations"
import formatReservationDate from "../utils/format-reservation-date";


export default function Seat(){
    const [tables, setTables] = useState([]);
    const [reservation, setReservation] = useState({});
    const [tablesError, setTablesError] = useState(null);
    const [formData, setFormData] = useState("Please select a table")
    const {reservation_id} = useParams();
    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();

        async function getTables(){
            const tablesFromApi = await listTables(abortController.signal)
            setTables(tablesFromApi)
        }
        
        async function getReservation(){
            const response = await readReservation(reservation_id, abortController.signal)
            if(response){
                const reservationFromApi =  formatReservationDate(response)
            setReservation(reservationFromApi);
        }
    }
        getReservation();
        getTables();
    }, [reservation_id])
    
    
    const formChange = (event) => {
        setFormData(event.target.value)
    }
    
    const formSubmit = async(event) => {
        event.preventDefault();
        try {
            if(formData === "Please select a table") throw new Error("Please Select a table")
            await updateTable(formData, {data: {reservation_id} })
            history.push(`/dashboard?date=${reservation.reservation_date}`)
        } catch(error) {
            setTablesError(error)
        }
    }
    const handleCancel = () => {
        setFormData("Please Select a Table");
        history.goBack();
    }
   
    return (
        <>
        <div className="d-flex flex-column align-items-center justify-content-center mt-5 mb-5">
        <form onSubmit={formSubmit} className="d-flex flex-column justify-content-center">
            <label htmlFor="table_id">
                <select 
                    id="table_id"
                    name="table_id"
                    onChange={formChange}
                    value={formData}
                >
                    <option> Please select a table</option>
                    {tables.map((table) => (
                        <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
                    ))}
                </select>
            </label>
            <div className="row">
             <button className="btn btn-success m-2" type="submit"><span className="oi oi-arrow-thick-bottom" /> Seat </button>
             <button className="btn btn-danger m-2" onClick={handleCancel}><span className="oi oi-ban" /> Cancel </button>
            </div>
        </form>
        
        {reservation.reservation_id && (
          <Reservations reservation={reservation} />
        )}
        </div>
        <ErrorAlert error={tablesError}/>
        </>
    )
}
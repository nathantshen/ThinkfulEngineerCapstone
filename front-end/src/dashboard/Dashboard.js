import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, formatDate } from "../utils/date-time";
import Table from "./Table";
import Reservations from "./Reservations"
import useQuery from "../utils/useQuery"



/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({today}) {
  const query = useQuery();
  
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [date, setDate] = useState(query.get('date') || today );
  

  
  const nextDayHandler = () => setDate(next(date));
  const prevDayHandler = () => setDate(previous(date));
  const todayHandler = () => setDate(today)
  
  useEffect(loadDashboard, [date]);
  
  function loadDashboard() {
    
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal)
    .then(setTables)
    .catch(error => console.error(error))
    
    return () => abortController.abort();
   
  }
  
 
  return (
    <main>
      <div className='text-center'>
        <h1 className="mb-2 text-center">Reservations for: </h1>
        <h3 className="mb-4"><span className="oi oi-calendar" /> { formatDate(date) }</h3>
      </div>
      <ErrorAlert error={reservationsError } />
      {/* {JSON.stringify(reservations)} */}
      <div className=" text-center mb-2">
      <button className="btn btn-warning mr-2" onClick={prevDayHandler}><span className="oi oi-arrow-thick-left"/> Prev </button>
      <button className="btn btn-dark mr-2" onClick={todayHandler} ><span className="oi oi-home"/> Today </button>
      <button className="btn btn-warning " onClick={nextDayHandler}> Next <span className="oi oi-arrow-thick-right"/></button>
      </div>
      <div className="card-group">
        {!reservations ? <h4>Loading...</h4>
        :
        reservations.map((reservation) => (
          <Reservations key={reservation.reservation_id} reservation={reservation} />
        ))}
      </div>
      <h1 className="text-center mt-5">Tables</h1>
      <div className="card-group">
        {!tables ? <h4>Loading...</h4> 
        :
        tables.map((table, index) => (
          <Table key={table.table_id} table={table} />
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
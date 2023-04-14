import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";
import ReservationDetail from "../layout/reservations/ReservationDetail";
import TableDetail from "../layout/tables/TableDetail";


function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState(date);

  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  
  const history = useHistory();
  const location = useLocation();
  const searchedDate = location.search.slice(-10);

// function to know when to toggle column with clear tables button

  function clearTables(tables) {
    let result = [];
    tables.forEach((table) => {
      if (table.reservation_id) {
        result.push(table);
      }
    })
    return result;
  }
  let clearTableToggler = clearTables(tables);

// useEffect's to load reservations and tables

  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservations() {
      try {
        if (currentDate === date) {
          const returnedReservations = await listReservations({ date }, abortController.signal);
          setReservations(returnedReservations);
        } else {
          const returnedReservations = await listReservations({ currentDate }, abortController.signal);
          setReservations(returnedReservations);
        }
      } catch (error) {
        setError(error);
      }
    }
    loadReservations();
    return () => abortController.abort();
  }, [date, currentDate, history.location])

  useEffect(() => {
    const abortController = new AbortController();

    async function loadTables() {
      try {
        const returnedTables = await listTables();
        setTables(returnedTables);
      } catch (error) {
        setError(error);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, [history, date, currentDate])

  useEffect(() => {
    if (searchedDate && searchedDate !== '') {
      setCurrentDate(searchedDate);
    }
  }, [searchedDate, history]);

// change day handlers

  const previousHandler = (event) => {
    event.preventDefault();
    history.push('/dashboard');
    setCurrentDate(previous(currentDate));
  }

  const todayHandler = (event) => {
    event.preventDefault();
    history.push('/dashboard');
    setCurrentDate(date);
  }

  const nextHandler = (event) => {
    event.preventDefault();
    history.push('/dashboard');
    setCurrentDate(next(currentDate));
  }
  
  if (reservations) {
    return (
      <main>
        <div className="mb-3">
          <h1>Dashboard</h1>
        </div>
        
        <div className="d-md-flex mb-3">
          <div className="row mb-3">
          <h4 className="ml-3">Reservations for date: {currentDate} </h4>
            <div className="">
              <button className="btn btn-primary ml-3" onClick={previousHandler}> Previous Day </button>
            </div>
            <div className="">
              <button className="btn btn-primary ml-3" onClick={todayHandler}> Today </button>
            </div>
            <div className="">
              <button className="btn btn-primary ml-3" onClick={nextHandler}> Next Day </button>
            </div>
            
          </div>
        </div>

        <ErrorAlert error={error} />
        <div>
          <h4> Reservation List </h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col"> ID </th>
                <th scope="col"> First Name </th>
                <th scope="col"> Last Name </th>
                <th scope="col"> Party Size </th>
                <th scope="col"> Phone Number </th>
                <th scope="col"> Date </th>
                <th scope="col"> Time </th>
                <th scope="col"> Status </th>
                <th scope="col"> Seat </th>
                <th scope="col"> Edit </th>
                <th scope="col"> Cancel </th>
               </tr>
             </thead>
            <tbody>
              {reservations.map((res) => (
                <ReservationDetail res={res} key={res.reservation_id} />
              ))}
            </tbody>
         </table>
        </div>

        <div>
          <h4> Tables List </h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col"> ID </th>
                <th scope="col"> Table Name </th>
                <th scope="col"> Capacity </th>
                <th scope="col"> Reservation ID </th>
                <th scope="col"> Table Status </th>
                {clearTableToggler.length ? 
                  <th scope="col"> Clear Tables </th>
                  : 
                  <></>}
               </tr>
             </thead>
            <tbody>
              {tables.map((table) => (
                <TableDetail table={table} key={table.table_id} />
              ))}
            </tbody>
         </table>
        </div>
      </main>
    );
  } else {
    return (
      <div>
        <h4> Dashboard Loading... </h4>
      </div>
    )
  }

}

export default Dashboard;

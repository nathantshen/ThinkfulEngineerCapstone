import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import NewReservation from "./reservations/ReservationCreate";
import Seat from "./Seat";
import NewTable from "./tables/NewTable";
import EditReservation from "./reservations/EditReservation";
import Search from "./Search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [date, setDate] = useState(today());

  const url = useRouteMatch();
  const query = useQuery();

  function loadDate() {
    const newDate = query.get('date');
    if (newDate) {
      setDate(newDate);
    }
  }

  useEffect(loadDate, [url, query]);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact path="/tables">
        <Dashboard date={date} />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/reservations/new">
        <NewReservation date={date}/>
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation date={date}/>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route path="/tables/new">
        <NewTable />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
  
}

export default Routes;



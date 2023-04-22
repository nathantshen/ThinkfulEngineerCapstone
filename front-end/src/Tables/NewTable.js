import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { createTable } from '../utils/api';
import ErrorAlert from "../layout/ErrorAlert";

export default function NewTable() {

  const defaultTableData = {
    table_name: "",
    capacity: 0
  };
  const [ tableData , setReservationData ] = useState({
    ...defaultTableData
  });
  const [ createTableError, setTableError ] = useState(null);
  const [ buttonDisable, setButtonDisable ] = useState(false);
  const history = useHistory();

  const changeHandler = event => {
    event.preventDefault();
    setReservationData({
      ...tableData,
      [event.target.name] : event.target.value
    });
  };

  const submitHandler = event => {
    event.preventDefault();
    event.stopPropagation();
    const controller = new AbortController();
    setButtonDisable(state => !state)
    createTable(tableData, controller.signal)
    .then(() => history.push('/'))
    .catch(setTableError)
    setButtonDisable(state => !state)
  };

  const cancelHandler = event => {
    event.preventDefault();
    setButtonDisable(state => !state);
    history.goBack()
  };

  return (
    <div>
    <h1>New Table</h1>
    {createTableError ? <ErrorAlert error={createTableError} /> : null}
    <form onSubmit={submitHandler} onReset={cancelHandler}>
      <div className="form-group">
        <label htmlFor="table_name">Table Name</label>
        <input
          type="text"
          className="form-control"
          name="table_name"
          id="table_name"
          placeholder="Table Name"
          value={tableData.table_name}
          onChange={changeHandler}
        />
      </div>
      <div className="form-group">
        <label htmlFor="capacity">Capacity</label>
        <input
          type="number"
          className="form-control"
          name="capacity"
          id="capacity"
          placeholder="capacity"
          value={tableData.capacity}
          onChange={changeHandler}
        />
      </div>
      <button type="submit" className="btn btn-primary m-1" disabled={buttonDisable}>
        Submit
      </button>
      <button type="reset" className="btn btn-danger m-1" disabled={buttonDisable}>
        Cancel
      </button>
    </form>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function Seat() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [ tableId, setTableId ] = useState(0);

  const loadTables = () => {
    console.log("loadTables")
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  };

  useEffect(loadTables, [tables]);

  const submitHandler = (event) => {
    event.preventDefault();
    const controller = new AbortController();
    updateTable(tableId, reservation_id, controller.signal)
    .then(()=> history.push("/"))
    .catch(setTablesError)
    return () => controller.abort()
  };

  const cancelHandler = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const changeHandler = event => {
    event.preventDefault();
    setTableId(event.target.value);
  }

  return (
    <div>
      <h1>Seat Reservation</h1>
      <ErrorAlert error={tablesError} />
      <form className="d-flex" onSubmit={submitHandler} onReset={cancelHandler}>
        <select name="table_id" className="form-select mb-2 mr-1" aria-label="Select Table" id="table_id" onChange={changeHandler}>
          <option defaultValue>Open this select menu</option>
          {tables.map((table) => {
            return (
              <option value={table.table_id} key={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            );
          })}
        </select>
        <button type="submit" className="btn btn-primary mb-2 mr-1 ml-1">
          Submit
        </button>
        <button type="reset" className="btn btn-danger mb-2 mr-1 ml-1">
          Cancel
        </button>
      </form>
    </div>
  );
}

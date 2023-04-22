import { useState } from 'react';
import { deleteTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function Table({ tables }) {

    const [ tablesError, setTablesError ] = useState(null);
    
    const finishHandler = event => {
        const controller = new AbortController();
        const userChoice = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
        if(userChoice) {
            deleteTable(Number(event.target.value), controller.signal)
            .catch(setTablesError)
        }
        return () => controller.abort();
    }
    
    return(
        <div>
        <ErrorAlert error={tablesError} /> 
        <table className='table'>
            <thead>
            <tr>
                <th scope='col'>Table Name</th>
                <th scope='col'>Status</th>
                <th scope='col'>Capacity</th>
                <th scope='col'></th>
            </tr>
            </thead>
            <tbody>
                {tables.map((table)=> {
                    return(
                        <tr key={table.table_id}>
                            <td>{table.table_name}</td>
                            <td>{table.status}</td>
                            <td>{table.capacity}</td>
                            <td>{table.status === "occupied" ? <button data-table-id-finish={table.table_id} type="button" className="btn btn-primary" onClick={finishHandler} value={table.table_id}>Finish</button> : null}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        </div>
    )
}
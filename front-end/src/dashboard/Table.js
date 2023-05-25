import React from "react"
import { useHistory } from "react-router-dom";
import { clearTable } from "../utils/api"

export default function Tables({ table }) {
  const history = useHistory();

  const finishHandler = async(event) => {
    event.preventDefault()

    if(window.confirm(
      'Is this table ready to seat new guests? This cannot be undone.'
    )){
      clearTable(table.table_id).then(() => {
        history.push('/')
      }).catch((err) => console.error(err));
    }
  }
  
    return(
        <>
        <div className="d-flex flex-column align-items-center"></div>
        <div className="col">
        <div className='card text-center text-white bg-secondary ml-2' style={{maxWidth:"18rem"}}>
        <div className="card-body">
          <h4 className="card-title">Table: {table.table_name}</h4>
          <p className="card-text">Capacity - <span className="oi oi-people" /> {table.capacity}</p>
          {table.occupied ?
            <>
              <div>
                <h6 data-table-id-status={table.table_id} className="btn btn-dark"><span className="oi oi-people" /> occupied</h6>
              </div>
              <button data-table-id-finish={table.table_id} onClick={(e)=>finishHandler(e)} className='btn btn-danger ml-2 px-2 oi oi-check'> Finish </button>
            </>
                : 
            <>
                <h6 data-table-id-status={table.table_id} className="btn btn-success oi oi-check"> free </h6>
            </>}
                
        </div>
      </div>
      </div>
        </>
    )
}
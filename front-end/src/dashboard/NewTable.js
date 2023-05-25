import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createTable } from '../utils/api';

export default function NewTable() {
    const history = useHistory();
    const initialState = {
        table_name:"",
        capacity: 0,
        reservation_id: null,
        occupied:false,
    }

    const [newTable, setNewTable] = useState({...initialState});
    const formChange = ({ target }) => {
        setNewTable({...newTable, [target.name]: target.value});
    }

    const formSubmit = async(event) => {
        event.preventDefault();
        await createTable(newTable)
        setNewTable({...initialState})
        history.push("/dashboard")
    }

    return (
        <>
        <div className="d-flex flex-column align-items-center">
        <h2 className="m-3">Create Table</h2>
        <form onSubmit={formSubmit} className="ml-5 p-5 text-white bg-dark">
        <div className="mb-3">
                <label htmlFor="table_name" className="form-label fw-bold">Table Name:</label>
                <input 
                type="text" 
                className="form-control" 
                id="table_name" 
                name="table_name"
                placeholder="Table Name" 
                value={newTable.table_name}
                onChange={formChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="capacity" className="form-label fw-bold">Capacity:</label>
                <input 
                type="text" 
                className="form-control" 
                id="capacity" 
                name="capacity"
                placeholder="Capacity" 
                onChange={formChange}
                value={newTable.capacity}
                />
            </div>
            <button className="btn btn-primary mt-5 mr-2"  type="submit"> Submit </button>
            <button className="btn btn-danger mt-5" onClick={() => history.goBack()}> Cancel </button>
        </form>
        </div>
        </>
    )
}
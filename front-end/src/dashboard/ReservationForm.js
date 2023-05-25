import React from "react"
import { useHistory } from "react-router"


export default function ReservationForm({ formChange, formSubmit, reservation, peopleFormChange}){
    const history = useHistory();
   
    return(
        <div className="d-flex flex-column align-items-center">
        <form onSubmit={ formSubmit } className="ml-5 p-5 text-white bg-dark" style={{width: "48rem"}}>
        <div className="mb-3">
                    <label htmlFor="first_name" className="form-label fw-bold">First Name:</label>
                    <input 
                    type="text" 
                    className="form-control" 
                    id="first_name" 
                    name="first_name"
                    placeholder="First Name" 
                    value={reservation.first_name}
                    onChange={formChange}
                    required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="last_name" className="form-lable fw-bold">Last Name:</label>
                    <input 
                    id="last_name" 
                    name="last_name" 
                    className="form-control" 
                    placeholder="Last Name"
                    value={reservation.last_name}
                    onChange={formChange}
                    required
                    />
                </div>
                <div className="mt-2">
                    <label htmlFor="mobile-number" className="formlable fw-bold">Mobile Number:</label>
                    <input 
                        id="mobile_number"
                        type="tel"
                        name="mobile_number"
                        className="form-control"
                        placeholder="(555)555-5555"
                        value={reservation.mobile_number}
                        onChange={formChange}
                        required
                    />
                </div>
                <div className="mt-2">
                    <label htmlFor="reservation_date" className="formlable fw-bold">Reservation Date:</label>
                    <input 
                        id="reservation_date"
                        type="date"
                        name="reservation_date"
                        className="form-control"
                        placeholder="YYYY-MM-DD"
                        value={reservation.reservation_date}
                        onChange={formChange}
                        required
                    />
                </div>
                <div className="mt-2">
                    <label htmlFor="reservation_time" className="formlable fw-bold">Reservation Time:</label>
                    <input 
                        id="reservation_time"
                        type="time"
                        name="reservation_time"
                        className="form-control"
                        placeholder="HH:MM"
                        value={reservation.reservation_time}
                        onChange={formChange}
                    />
                </div>
                <div className="mt-2">
                    <label htmlFor="people" className="formlable fw-bold">People:</label>
                    <input 
                        type="text"
                        id="people"
                        name="people"
                        className="form-control"
                        placeholder="Number of people in party must be 1 or more."
                        onChange={peopleFormChange}
                        required
                    />
                </div>
                <button className="btn btn-success mt-5 mr-2 oi oi-book"  type="submit"> Book </button>
                <button className="btn btn-danger mt-5 oi oi-ban" onClick={() => history.goBack()}> Cancel </button>
        </form>
        </div>
    )
}
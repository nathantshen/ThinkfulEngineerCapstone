import React from "react";
import Form from "./Form";

function ReservationEdit({reservation_id}) {
  return (
    <section>
      <h1> Edit Reservation: {reservation_id} </h1>
      <Form/>
    </section>
  )
}

export default ReservationEdit;
import { useHistory } from "react-router-dom";
import { cancelReservation } from "../utils/api";

export default function Reservation({ reservations }) {
  const history = useHistory();

  const cancelHandler = (event) => {
    event.preventDefault();
    const controller = new AbortController();
    const index =
      event.target.parentElement.parentElement.getAttribute("index");
    const rock = window.confirm("Do you really want to change this?");
    if (rock) {
      cancelReservation(reservations[index], controller.signal).then(() =>
        history.push("/")
      );
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Mobile Number</th>
          <th scope="col">Reservation Day</th>
          <th scope="col">Reservation Time</th>
          <th scope="col">Number of People</th>
          <th scope="col">Status</th>
          <th scope="col">Options</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map(
          (
            {
              reservation_id,
              first_name,
              last_name,
              mobile_number,
              reservation_date,
              reservation_time,
              people,
              status,
            }
          ) => {
            if (status !== "finished") {
              return (
                <tr key={reservation_id}>
                  <td>{first_name}</td>
                  <td>{last_name}</td>
                  <td>{mobile_number}</td>
                  <td>{reservation_date}</td>
                  <td>{reservation_time}</td>
                  <td>{people}</td>
                  <td>{status}</td>
                  <td>
                    {status === "booked" ? (
                      <>
                        <a
                          className="btn btn-primary m-1"
                          href={`/reservations/${reservation_id}/edit`}
                          role="button"
                        >
                          Edit
                        </a>
                        <a
                          className="btn btn-primary m-1"
                          href={`/reservations/${reservation_id}/seat`}
                          role="button"
                        >
                          Seat
                        </a>
                        <button
                          type="button"
                          className="btn btn-danger m-1"
                          onClick={cancelHandler}
                        >
                          Cancel
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            }
            return null;
          }
        )}
      </tbody>
    </table>
  );
}

/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}


//Retrieves all existing reservations

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}


//Creates new reservation

export async function createReservation(reservation, signal){

  const url = new URL(`${API_BASE_URL}/reservations`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({data: reservation}),
    signal,
  }
  return await fetchJson(url, options, reservation);  
}


//Retrieves a single reservation

export async function readReservation(reservation_id, signal){

  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { signal }, {})
    .then(formatReservationDate)
    .then(formatReservationTime);
}

//Updates a single reservation

export async function updateReservation(reservation_id, updatedReservation){
  const url = new URL(
    `${API_BASE_URL}/reservations/${reservation_id}`
  );
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({data: updatedReservation}),
  };
  return await fetchJson(url, options, updatedReservation)
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function updateTable(table_id, reservation_id) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data :{reservation_id:reservation_id} }),
  };
  return await fetchJson(url, options );
}

//Creates a new table

export async function createTable(table){
 
   const url = new URL(`${API_BASE_URL}/tables`);
   const options = {
     method: "POST",
     headers,
     body: JSON.stringify({ data: table }),
   };
   return await fetchJson(url, options, table);
  
}

export async function clearTable(table_id){
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat/`);
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({ data: {table_id }}),
  };
  return await fetchJson(url, options, table_id);
}


//Retrieves all tables

export async function listTables(signal){
  const url = new URL(`${API_BASE_URL}/tables`);
  const options={
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

//Assigns a reservation_id to a table

export async function seatReservation(table_id, reservation_id, signal){

  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat/`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id} }),
    signal,
};

  return await fetchJson(url, options, {});

}


//update reservation status to seated

export async function updateReservationStatus(reservation_id, signal){
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  const options={
    method: "PUT",
    headers,
    body: JSON.stringify({data: {status: "seated"}}),
    signal,
  };
  return await fetchJson(url, options, reservation_id)
}

//update reservation status to cancelled

export async function cancelReservation(reservation_id, signal){
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  const options ={method: "PUT", headers, body:JSON.stringify({data: { status: "cancelled" } }), signal};
  return await fetchJson(url, options)
}


//deletes a table

export async function finishTable(table_id, signal){
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat/`);
  const options ={ method: "DELETE", headers, body: JSON.stringify({data: table_id}), signal};
  return await fetchJson(url, options, {});
}

//Retrieves all reservations with the same mobile number

export async function searchReservations(mobile_number, signal){
  const url = new URL(`${API_BASE_URL}/reservations?mobile_number=${mobile_number}`);
  return await fetchJson(url, { signal })
    .then(formatReservationDate)
    .then(formatReservationTime);
}





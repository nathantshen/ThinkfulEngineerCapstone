import React from "react";
import { useHistory } from "react-router-dom";

/**
 * Defines the "Not Found" page that is displayed for any unmatched route.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function NotFound() {
  const history = useHistory();

  return (
    <div className="NotFound">
      <h1>Not Found</h1>
      <button type="button" className="btn btn-primary" onClick={() => history.goBack()}> Go Back </button>
    </div>
  );
}

export default NotFound;

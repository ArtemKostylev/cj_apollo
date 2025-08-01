import React from "react";
import "../styles/Error.css";

//503 - no server

export const ErrorScreen = ({ error, resetErrorBoundary }) => {
  let displayCode;
  let displayMessage;

  switch (error.message) {
    case "503":
      displayCode = 503;
      displayMessage = "К сожалению, сервер не доступен.";
      break;
    default:
      displayCode = 404;
      displayMessage = "Ошибка";
      break;
  }
  console.log(error.message);
  return (
    <div className="error_container">
      <h1 className="error_code">{displayCode}</h1>
      <p className="error_message">{displayMessage}</p>
    </div>
  );
};

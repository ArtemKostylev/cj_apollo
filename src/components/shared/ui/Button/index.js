import React from "react";
import "./button.css";

export const Button = ({ text, onClick }) => {
  return (
    <button className="button_primary" onClick={onClick}>
      {text}
    </button>
  );
};

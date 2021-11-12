import React from "react";
import "./formInput.css";

export const FormInput = ({
  value,
  onChange,
  type,
  name,
  autoComplete,
  size,
  placeholder,
}) => {
  return (
    <input
      className="form_input"
      value={value}
      onChange={onChange}
      type={type}
      name={name}
      autoComplete={autoComplete}
      size={size}
      placeholder={placeholder}
    />
  );
};

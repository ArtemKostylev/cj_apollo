import React, { forwardRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/Journal.css";
import ru from "date-fns/locale/ru";
import { getYear } from "../scripts/utils";
import moment from "moment";

const EditableDateCell = ({
  initialValue,
  updateDates,
  column,
  group,
  month,
  row,
  full = true,
  disabled = false,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (disabled) {
    return (
      <p>
        {value
          ? `${value.split("/")[1]}.${value.split("/")[0]}${
              full ? "." + value.split("/")[2] : ""
            }`
          : "....."}
      </p>
    );
  }
  const Input = forwardRef(({ value, onClick }, ref) => (
    <p
      onClick={onClick}
      ref={ref}
      style={{ padding: "0", cursor: "pointer", margin: "0" }}
    >
      {value
        ? `${value.split("/")[1]}.${value.split("/")[0]}${
            full ? "." + value.split("/")[2] : ""
          }`
        : "....."}
    </p>
  ));

  const start_date = moment()
    .clone()
    .year(getYear(month - 1))
    .month(month - 1)
    .startOf("month")
    .toDate();
  const end_date = moment()
    .clone()
    .year(getYear(month - 1))
    .month(month - 1)
    .endOf("month")
    .toDate();
  return (
    <DatePicker
      selected={value}
      onChange={(date) => {
        updateDates({
          date: date,
          column: column,
          group: group,
          row: row || 0,
        });
        setValue(date);
      }}
      customInput={<Input />}
      minDate={start_date}
      maxDate={end_date}
      locale={ru}
    />
  );
};

export default EditableDateCell;

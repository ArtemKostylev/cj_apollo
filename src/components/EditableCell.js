import React from "react";
import { AVAILABLE_MARKS } from "../scripts/constants";
import { useOnClickOutside } from "../scripts/utils";
import "../styles/Journal.css";

export const EditableCell = ({
  value: initialValue,
  row: index,
  column: id,
  weekend,
  updateMyData,
  group = -1,
}) => {
  const [value, setValue] = React.useState(initialValue);
  const [dropdownVisible, setDropdownVisibility] = React.useState(false);
  const [dropdownWidth, setDropdownWidth] = React.useState(0);

  const Dropdown = (visible) => {
    const onClick = (e) => {
      if (AVAILABLE_MARKS.includes(e.target.innerHTML)) {
        let mark = "";
        if (e.target.innerHTML !== "Пусто") mark = e.target.innerHTML;
        setValue(mark);
        setDropdownVisibility(false);
        if (!updateMyData(index, id, mark, group)) setValue("");
      }
    };

    return (
      <div
        className={`dropdown ${visible ? "visible" : ""}`}
        style={{ width: `${dropdownWidth}px` }}
      >
        <ul>
          <li onClick={onClick}>Пусто</li>
          <li onClick={onClick}>.</li>
          <li onClick={onClick}>2</li>
          <li onClick={onClick}>3</li>
          <li onClick={onClick}>4</li>
          <li onClick={onClick}>5</li>
          <li onClick={onClick}>Б</li>
        </ul>
      </div>
    );
  };

  const ref = React.useRef();

  useOnClickOutside(ref, () => setDropdownVisibility(false));

  const onClick = () => {
    if (!dropdownVisible) setDropdownVisibility(true);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    setDropdownWidth(ref.current.clientWidth);
  }, [setDropdownWidth]);

  return (
    <td onClick={onClick} ref={ref} className={`${weekend}`}>
      <p className="input">{value}</p>
      {Dropdown(dropdownVisible)}
    </td>
  );
};

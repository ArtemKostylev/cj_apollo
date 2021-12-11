import React, { useState, useEffect } from "react";
import { useOnClickOutside } from "../../../utils/utils";
import "../../../styles/Journal.css";

const Dropdown = ({ inverted, visible, onClick, width, ref }) => {
  return (
    <div
      className={`dropdown ${visible ? "visible" : ""} ${
        !inverted || "inverted"
      }`}
      style={{ width: `${width}px` }}
      ref={ref}
    >
      {
        <ul>
          <li>
            <p onClick={onClick}>0</p>
          </li>
          <li>
            <p onClick={onClick}>0.5</p>
          </li>
          <li>
            <p onClick={onClick}>1</p>
          </li>
          <li>
            <p onClick={onClick}>1.5</p>
          </li>
          <li>
            <p onClick={onClick}>2</p>
          </li>
          <li>
            <p onClick={onClick}>2.5</p>
          </li>
          <li>
            <p onClick={onClick}>3</p>
          </li>
        </ul>
      }
    </div>
  );
};

// TODO: replace with editable cell
export const EditableCellHours = (initialValue, updateData, row, column) => {
  const [value, setValue] = useState(initialValue);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [inverted, setInverted] = useState(false);

  const ref = React.useRef();

  useOnClickOutside(ref, () => setDropdownVisible(false));

  const onDropdownItemClick = (e) => {
    setValue(parseFloat(e.target.innerHTML));
    setDropdownVisible(false);
    if (!updateData()) setValue(0);
  };

  const onCellClick = () => {
    if (!dropdownVisible) setDropdownVisible(true);
  };

  useEffect(() => {
    if (dropdownVisible) {
      const bounds = ref.current.getBoundingClientRect();
      if (
        bounds.bottom >
        (window.innerHeight || document.documentElement.clientHeight)
      ) {
        setInverted(true);
      }
    }
  }, [setInverted, dropdownVisible]);

  useEffect(() => {
    setDropdownWidth(ref?.current?.clientWidth || 0);
  }, [setDropdownWidth, ref?.current?.clientWidth]);

  return (
    <td onClick={onCellClick} ref={ref}>
      <p className="input">{value}</p>
      {Dropdown(
        inverted,
        dropdownVisible,
        onDropdownItemClick,
        dropdownWidth,
        ref
      )}
    </td>
  );
};

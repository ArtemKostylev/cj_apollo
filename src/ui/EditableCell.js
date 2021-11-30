import React from 'react';
import { useOnClickOutside } from '../../scripts/utils';
import '../styles/Journal.css';

import styled from 'styled-components';

const DropdownOption = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  text-align: center;
  padding: 0;
`;

const DropdownOptionsList = (options) => {

  const  = options.

};

const Dropdown = (visible) => {
  const onClick = (e) => {
    let mark = '';
    if (e.target.innerHTML !== 'пусто') mark = e.target.innerHTML;
    setValue(mark);
    setDropdownVisibility(false);
    if (!updateMyData(index, id, mark, group)) setValue('');
  };
  const [inverted, setInverted] = React.useState(false);

  const ref = React.useRef();

  React.useEffect(() => {
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

  return (
    <div
      className={`dropdown ${visible ? 'visible' : ''} ${
        !inverted || 'inverted'
      }`}
      style={{ width: `${dropdownWidth}px` }}
      ref={ref}
    >
      {
        <ul>
          <li onClick={onClick}>
            <p style={{ width: '100%' }}>пусто</p>
          </li>
          <li>
            <p onClick={onClick}>.</p>
            <p onClick={onClick}>2</p>
          </li>
          <li>
            <p onClick={onClick}>3</p>
            <p onClick={onClick}>4-</p>
          </li>
          <li>
            <p onClick={onClick}>4</p>
            <p onClick={onClick}>4+</p>
          </li>
          <li>
            <p onClick={onClick}>5-</p>
            <p onClick={onClick}>5</p>
          </li>
          <li>
            <p onClick={onClick}>5+</p>
            <p onClick={onClick}>Б</p>
          </li>
        </ul>
      }
    </div>
  );
};

// TODO: fix all import to named from default

export const EditableCell = ({
  value: initialValue,
  row: index,
  column: id,
  weekend = '',
  updateMyData,
  group = -1,
  disabled = false,
}) => {
  const [value, setValue] = React.useState(initialValue);
  const [dropdownVisible, setDropdownVisibility] = React.useState(false);
  const [dropdownWidth, setDropdownWidth] = React.useState(0);

  const ref = React.useRef();

  useOnClickOutside(ref, () => setDropdownVisibility(false));

  const onClick = () => {
    if (!dropdownVisible) setDropdownVisibility(true);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    setDropdownWidth(ref?.current?.clientWidth || 0);
  }, [setDropdownWidth, ref?.current?.clientWidth]);

  React.useEffect(() => {});
  if (disabled) {
    return (
      <td ref={ref}>
        <p style={{ color: 'gray', margin: '0' }}>{value}</p>
      </td>
    );
  }
  return (
    <td onClick={onClick} ref={ref} className={`${weekend}`}>
      <p className='input'>{value}</p>
      {Dropdown(dropdownVisible)}
    </td>
  );
};

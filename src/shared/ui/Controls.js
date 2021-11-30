import { useOnClickOutside } from '../../scripts/utils';
import '../styles/Controls.css';
import React, { useRef, useState } from 'react';

const Controls = (props) => {
  /* 
    Controls component with dropdown

    props:
    - data: array of elements to diaplay in dropdown. 
    - text: value to display in controls item
    - onClick: function to execute on click. Receives event as parameter.
    - label: label of controls item
  */
  const ControlsItemDropdown = (props) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [value, setValue] = useState(props.text || 'Нет значений');

    const onClick = () => {
      if (!dropdownVisible) setDropdownVisible(true);
    };

    const ref = useRef();

    useOnClickOutside(ref, () => setDropdownVisible(false));

    const Dropdown = () => {
      const onClick = (e) => {
        e.preventDefault();
        setDropdownVisible(false);
        setValue(e.target.innerHTML);
        props.onClick(e);
      };

      return (
        <div
          className={`controls_item__dropdown ${
            dropdownVisible ? 'visible' : ''
          }`}
        >
          <ul>
            {props?.data?.map((item, index) => (
              <li data-index={index} key={item} onClick={(e) => onClick(e)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    return (
      <>
        <span className='controls_item__label'>{props.label}</span>
        <span
          className={`controls_item ${dropdownVisible ? 'visible' : ''}`}
          onClick={onClick}
          ref={ref}
        >
          <p className='controls_item__text'>{value}</p>
          <span className='arrow' />
          <Dropdown />
        </span>
      </>
    );
  };

  /* 
    Controls button component
    props:
    - text: button text
    - onClick: function to execute on click. Receives event as parameter.
  */
  const ControlsItemButton = (props) => {
    const onClick = (e) => {
      e.preventDefault();
      props.onClick(e);
    };

    return (
      <button
        className='controls_item__button'
        disabled={props.disabled}
        onClick={onClick}
      >
        {props.text}
      </button>
    );
  };

  /* 
    Controls input component
    props:
    - text: initial value of input
    - onClick: function to execute on change. Receives event as parameter.
    - label: label for input
  */
  const ControlsItemInput = (props) => {
    const [value, setValue] = useState(props.text);

    const onChange = (e) => {
      e.preventDefault();
      setValue(e.target.value);
      if (e.target.value.length === 4) props.onClick(e);
    };

    return (
      <>
        <p className='controls_item__label'>{props.label}</p>
        <input
          maxLength='4'
          className='controls_item__input'
          onChange={onChange}
          value={value}
        ></input>
      </>
    );
  };

  return (
    <div className='controls_container noselect'>
      {props.items.map((item) => {
        if (item.type === 'dropdown') {
          return (
            <ControlsItemDropdown
              key={item.text}
              data={item.data}
              label={item.label}
              onClick={item.onClick}
              text={item.text}
            />
          );
        }
        if (item.type === 'button') {
          return (
            <ControlsItemButton
              key={item.text}
              onClick={item.onClick}
              text={item.text}
            />
          );
        }

        return (
          <ControlsItemInput
            key={item.text}
            label={item.label}
            onClick={item.onClick}
            text={item.text}
          />
        );
      })}
    </div>
  );
};

export default Controls;

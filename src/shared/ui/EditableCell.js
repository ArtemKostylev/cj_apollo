import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../utils/utils';
import { Dropdown } from './Dropdown';

const CellText = styled.p`
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  margin: 0px;
`;

const EditableCellLayout = styled.td`
  border-top: none;
  border: 1px solid #e6eaea;
  border-collapse: collapse;
  padding: 0px;
  cursor: pointer;
  line-height: 6vh;

  ${({ disabled }) => disabled && 'background-color: #e6eaea'};

  ${({ isWeekend }) => isWeekend && 'background-color: #eff0f0'};

  &:hover {
    background-color: #e6eaea;
  }
`;

export const EditableCell = ({
  value: initialValue = '',
  options,
  isWeekend = false,
  onClick,
  disabled,
}) => {
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const ref = useRef();

  const width = ref.current?.clientWidth || 0;

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <EditableCellLayout
      onClick={() => setOpen((prev) => !prev)}
      ref={ref}
      isWeekend={isWeekend}
      disabled={disabled}
    >
      <CellText>{value}</CellText>
      {!disabled && (
        <Dropdown
          open={open}
          options={options}
          onClick={(e) => {
            onClick(e.target.getAttribute('value'));
            setValue(e.target.getAttribute('value'));
          }}
          width={width}
        />
      )}
    </EditableCellLayout>
  );
};

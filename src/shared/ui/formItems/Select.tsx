import React, {useCallback, useRef, useState} from 'react';
import {useOnClickOutside} from '../../../hooks/useOnClickOutside';
import {Dropdown, DropdownOptionType} from '../Dropdown';
import styled from 'styled-components';

export type SelectProps = {
  options?: Map<string, DropdownOptionType>;
  text?: string;
  onClick?: (value: string) => void;
  label?: string;
}

const DEFAULT_SELECT_VALUE = 'Нет значений';

const ControlContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`

const ControlLabel = styled.span`

`;

const SelectText = styled.span`

`;

export const Select = ({options, text, onClick, label}: SelectProps) => {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState(text || DEFAULT_SELECT_VALUE);

  const onSelect = useCallback((value: string) => {
    setOpened(false);
    onClick && onClick(value);
    setValue(value);
  }, [value, onClick]);

  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpened(false));

  if (!options) return (
    <ControlContainer>
      {DEFAULT_SELECT_VALUE}
    </ControlContainer>
  )

  return (
    <ControlContainer>
      {label && <ControlLabel>{label}</ControlLabel>}
      <div ref={ref}>
        <SelectText>value</SelectText>
        <Dropdown opened={opened} options={options} onSelect={onSelect}/>
      </div>
    </ControlContainer>
  );
};
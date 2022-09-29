import React, {useCallback, useRef, useState} from 'react';
import {useOnClickOutside} from '../../../hooks/useOnClickOutside';
import {Dropdown, DropdownOptionType} from '../Dropdown';
import styled from 'styled-components';

export type SelectProps = {
  options?: Map<string, DropdownOptionType>;
  text?: string;
  onClick?: (param: any) => void;
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

export const Select = ({options, text, onClick}: SelectProps) => {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<string | number>(text || DEFAULT_SELECT_VALUE);

  const onSelect = useCallback((value: string | number) => {
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
      <div ref={ref}>
        <SelectText>value</SelectText>
        <Dropdown opened={opened} options={options} onSelect={onSelect}/>
      </div>
    </ControlContainer>
  );
};
import React, {useCallback, useRef, useState} from 'react';
import {useOnClickOutside} from '../../../hooks/useOnClickOutside';
import {Dropdown, DropdownOptionType} from '../Dropdown';
import styled from 'styled-components';
import {ButtonBase} from './Button';
import {ControlContainer} from './ControlContainer.styled';

export type SelectProps = {
  options?: Map<string, DropdownOptionType>;
  text?: string;
  onClick?: (param: any) => void;
}

const DEFAULT_SELECT_VALUE = 'Нет значений';

export const Select = ({options, text, onClick}: SelectProps) => {
  const [opened, setOpened] = useState(false);

  const onSelect = useCallback((value: string | number) => {
    setOpened(false);
    onClick && onClick(value);
  }, [onClick]);

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
        <ButtonBase onClick={() => setOpened(true)}>{text}</ButtonBase>
        <Dropdown opened={opened} options={options} onSelect={onSelect}/>
      </div>
    </ControlContainer>
  );
};
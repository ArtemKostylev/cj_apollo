import React, {useCallback, useRef, useState} from 'react';
import {useOnClickOutside} from '../../hooks/useOnClickOutside';
import {Dropdown} from '../Dropdown';
import {ButtonBase} from './Button';
import {ControlContainer} from './style/ControlContainer.styled';
import {FormItemWrapper} from './FormItemWrapper';
import {BaseFormItemProps} from './types';
import {Label} from './Label';
import styled from 'styled-components';

export type SelectProps = {
  options?: Map<string | number, DropdownOptionType>;
  text?: string;
  onClick?: (param: any) => void;
};

interface FormSelectProps extends BaseFormItemProps {
  options?: Map<string | number, DropdownOptionType>;
}

const DEFAULT_SELECT_VALUE = 'Нет значений';

const BaseSelectComponent = ({options, text, onClick}: SelectProps) => {
  const [opened, setOpened] = useState(false);

  const onSelect = useCallback(
    (value: string | number) => {
      setOpened(false);
      onClick && onClick(value);
    },
    [onClick]
  );

  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpened(false));

  console.log(options);

  if (!options) return <>{DEFAULT_SELECT_VALUE}</>;

  return (
    <div ref={ref}>
      <ButtonBase onClick={() => setOpened(true)}>{text}</ButtonBase>
      <Dropdown opened={opened} options={options} onSelect={onSelect}/>
    </div>
  );
}

export const Select = (props: SelectProps) => (
  <ControlContainer>
    <BaseSelectComponent {...props}/>
  </ControlContainer>
);

const SelectStyled = styled.select`
  text-indent: 10px;
  line-height: 3rem;
  font-size: 1.3rem;
  outline: none;
  border: none;
  width: 70%;
  min-width: 400px;
  background-color: #e6eaea;
  padding: 10px;
`;

export const FormSelect = ({name, value, onChange, label, options, required}: FormSelectProps) => {
  console.log(value);

  return (
    <FormItemWrapper>
      <Label htmlFor={name}>{label}:</Label>
      <SelectStyled id={name} name={name} value={value ? value : " "} onChange={(e) => {
        console.log(e.target.value);
        onChange(name, e.target.value)
      }} required={required}>
        <option value=" ">Выберите значение</option>
        {Array.from(options?.values() || []).map(it => <option key={it.value} value={it.value}>{it.text}</option>)}
      </SelectStyled>
    </FormItemWrapper>
  )
}
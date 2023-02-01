import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useOnClickOutside} from '../../hooks/useOnClickOutside';
import {Dropdown} from '../Dropdown';
import {ButtonBase} from './Button';
import {ControlContainer} from './style/ControlContainer.styled';

export type SelectProps = {
  options: Map<string | number, DropdownOptionType>;
  text: string | number;
  onClick: (param: any) => void;
}

const DEFAULT_SELECT_VALUE = 'Нет значений';

export const Select = ({options, text, onClick}: SelectProps) => {
  const [opened, setOpened] = useState(false);

  console.log(text);

  const selectValue = useMemo(() => options.get(text)?.text, [options, text])
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
        <ButtonBase onClick={() => setOpened(true)}>{selectValue}</ButtonBase>
        <Dropdown opened={opened} options={options} onSelect={onSelect}/>
      </div>
    </ControlContainer>
  );
};
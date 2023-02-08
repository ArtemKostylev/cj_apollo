import React, {useState, useEffect, useRef, memo} from 'react';
import {useOnClickOutside} from '../../../hooks/useOnClickOutside';
import {Dropdown} from '../../Dropdown';
import {SelectCellLayout} from './style/SelectCellLayout.styled';
import {CellText} from './style/CellText.styled';

export const SelectCell = memo(({value = '', onChange, disabled = false, error, options}: TableItemProps) => {
  const isWeekend = options?.isWeekend;
  const selectOptions = options?.selectOptions || new Map();
  const [dropdownValue, setDropdownValue] = useState<string | number>(value);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setDropdownValue(value);
  }, [value]);

  const ref = useRef() as any;

  const width = ref.current?.clientWidth || 0;

  useOnClickOutside(ref, () => setOpened(false));

  const onClick = () => setOpened((prev) => !prev);

  return (
    <SelectCellLayout error={error} ref={ref} onClick={onClick} isWeekend={isWeekend} disabled={disabled}>
      <CellText>{dropdownValue === '.' ? '✓' : dropdownValue}</CellText>
      {!disabled && (
        <Dropdown opened={opened} options={selectOptions} width={width} onSelect={(value) => {
          onChange(value);
          setDropdownValue(value);
        }}/>
      )}
    </SelectCellLayout>
  );
});

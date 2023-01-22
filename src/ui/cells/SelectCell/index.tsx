import React, {useState, useEffect, useRef, ReactElement, memo} from 'react';
import {useOnClickOutside} from '../../../hooks/useOnClickOutside';
import {Dropdown} from '../../Dropdown';
import {SelectCellLayout} from './style/SelectCellLayout.styled';
import {CellText} from './style/CellText.styled';

type Props = {
  value: string | number | undefined;
  options: Map<string | number, DropdownOptionType>;
  isWeekend?: boolean;
  onSelect: OnSelectType;
  disabled?: boolean;
  renderItem?: (onClick: () => void) => ReactElement;
  error?: boolean;
}

export const SelectCell = memo(({value = '', options, isWeekend = false, onSelect, disabled = false, error}: Props) => {
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
        <Dropdown opened={opened} options={options} width={width} onSelect={(value) => {
          onSelect(value);
          setDropdownValue(value);
        }}/>
      )}
    </SelectCellLayout>
  );
});

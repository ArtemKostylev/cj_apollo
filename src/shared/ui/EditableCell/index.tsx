import React, {useState, useEffect, useRef} from 'react';
import {useOnClickOutside} from '../../../hooks/useOnClickOutside';
import {Dropdown, DropdownOptionType} from '../Dropdown';
import {EditableCellLayout} from './EditableCellLayout.styled';
import {CellText} from './CellText.styled';

type Props = {
  value: string;
  options: Map<string, DropdownOptionType>;
  isWeekend: boolean;
  onClick: (value: string) => void;
  disabled: boolean;
}

export const EditableCell = ({value = '', options, isWeekend = false, onClick, disabled}: Props) => {
  const [dropdownValue, setDropdownValue] = useState(value);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setDropdownValue(value);
  }, [value]);

  const ref = useRef() as any;

  const width = ref.current?.clientWidth || 0;

  useOnClickOutside(ref, () => setOpened(false));

  return (
    <EditableCellLayout onClick={() => setOpened((prev) => !prev)} ref={ref} isWeekend={isWeekend}
                        disabled={disabled}>
      <CellText>{dropdownValue === '.' ? '✓' : dropdownValue}</CellText>
      {!disabled && (
        <Dropdown
          opened={opened}
          options={options}
          onSelect={(value) => {
            onClick(value);
            setDropdownValue(value);
          }}
          width={width}
        />
      )}
    </EditableCellLayout>
  );
};

import React, {useEffect, useRef, useState} from 'react';
import {DropdownOption} from './style/DropdownOption.styled';
import {DropdownLayout} from './style/DropdownLayout.styled';

type DropdownOptionsListProps = {
  options: Map<string | number, DropdownOptionType>
  onClick: (value: string | number) => void;
}

const DropdownOptionsList = ({options, onClick}: DropdownOptionsListProps) => {
  return <>
    {Array.from(options.values()).map((option) => (
      <DropdownOption short={option.short} key={option.value} onClick={() => onClick(option.value)}>
        {option.text}
      </DropdownOption>
    ))}
  </>;
};

type DropdownProps = {
  opened: boolean;
  options: Map<string | number, DropdownOptionType>;
  onSelect: (value: string | number) => void;
  width?: string;
}

export const Dropdown = ({opened, options, onSelect, width = 'auto'}: DropdownProps) => {
  const [inverted, setInverted] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const bounds = (ref.current as any).getBoundingClientRect();

    if (bounds.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
      setInverted(true);
    }
  }, [setInverted, opened]);

  return (
    <DropdownLayout open={opened} inverted={inverted} width={width} ref={ref}>
      <DropdownOptionsList options={options} onClick={onSelect}/>
    </DropdownLayout>
  );
};

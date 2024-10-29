import { useCallback, useRef, useState } from 'react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import * as S from './styles';
import { Dropdown } from '../Dropdown';

export interface ControlSelectProps {
    options?: Map<string | number, DropdownOptionType>;
    text?: string;
    onClick?: (param: any) => void;
};

const DEFAULT_SELECT_VALUE = 'Нет значений';

export function ControlSelect({ options, text, onClick }: ControlSelectProps) {
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

    if (!options) return (
        <span>{DEFAULT_SELECT_VALUE}</span>
    );

    return (
        <S.TableControlItem ref={ref}>
            <S.ControlItemButton onClick={() => setOpened(true)}>{text}</S.ControlItemButton>
            <Dropdown opened={opened} options={options} onSelect={onSelect} />
        </S.TableControlItem>
    );
}
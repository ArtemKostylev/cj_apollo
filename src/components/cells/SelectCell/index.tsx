import { useState, useEffect, useRef, ReactElement, memo } from 'react';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { Dropdown } from '../../dropdown';
import { TableCell } from '../TableCell';
import styles from './selectCell.module.css';

type Props = {
    value: string | undefined;
    options: DropdownOptionType[];
    isWeekend?: boolean;
    onSelect: OnSelectType;
    disabled?: boolean;
    renderItem?: (onClick: () => void) => ReactElement;
};

export const SelectCell = memo(
    ({
        value = '',
        options,
        isWeekend = false,
        onSelect,
        disabled = false
    }: Props) => {
        const [dropdownValue, setDropdownValue] = useState<string>(
            value
        );
        const [opened, setOpened] = useState(false);

        useEffect(() => {
            setDropdownValue(value);
        }, [value]);

        const ref = useRef<HTMLDivElement>(null);

        const width = ref.current?.clientWidth || 0;

        useOnClickOutside(ref, () => setOpened(false));

        const onClick = () => setOpened((prev) => !prev);

        return (
            <TableCell
                ref={ref}
                onClick={onClick}
                isWeekend={isWeekend}
                disabled={disabled}
            >
                <p className={styles.cellText}>
                    {dropdownValue === '.' ? '✓' : dropdownValue}
                </p>
                {!disabled && (
                    <Dropdown
                        opened={opened}
                        options={options}
                        width={`${width}px`}
                        onSelect={(value) => {
                            onSelect(value);
                            setDropdownValue(value);
                        }}
                    />
                )}
            </TableCell>
        );
    }
);

import { useCallback, useRef, useState } from 'react';
import { useOnClickOutside } from '~/hooks/useOnClickOutside';
import styles from './controlSelect.module.css';
import controlStyles from '../tableControls.module.css';
import { Dropdown } from '~/components/dropdown';
import type { DropdownOptionType } from '~/models/dropdownOption';
import { DROPDOWN_THEMES } from '~/components/dropdown/dropdownTheme';

export type SelectProps = {
    options?: DropdownOptionType[];
    buttonText?: string;
    onSelect: (value: string | number) => void;
};

const DEFAULT_SELECT_VALUE = 'Нет значений';

export const ControlSelect = (props: SelectProps) => {
    const { options, buttonText, onSelect } = props;

    const [opened, setOpened] = useState(false);

    const toggleOpened = useCallback(() => {
        setOpened((prev) => !prev);
    }, []);

    const onSelectInternal = useCallback(
        (value: string | number) => {
            setOpened(false);
            onSelect && onSelect(value);
        },
        [onSelect]
    );

    const ref = useRef(null);

    useOnClickOutside(ref, () => setOpened(false));

    if (!options) return <>{DEFAULT_SELECT_VALUE}</>;

    return (
        <div className={controlStyles.controlItem} ref={ref}>
            <button className={styles.selectButton} onClick={toggleOpened}>
                {buttonText}
            </button>
            <Dropdown theme={DROPDOWN_THEMES.CONTROL} opened={opened} options={options} onSelect={onSelectInternal} shrinkOutOfBounds />
        </div>
    );
};

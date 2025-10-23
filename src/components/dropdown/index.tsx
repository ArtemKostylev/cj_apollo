import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useOnClickOutside } from '~/hooks/useOnClickOutside';
import styles from './dropdown.module.css';
import { DropdownOption } from './DropdownOption';
import type { DropdownOptionType } from '~/models/dropdownOption';
import { DROPDOWN_THEMES, type DropdownTheme } from './dropdownTheme';

type Props = {
    shrinkOutOfBounds?: boolean;
    opened: boolean;
    options: DropdownOptionType[];
    onSelect: (value: string) => void;
    width?: string;
    theme?: DropdownTheme;
};

export const Dropdown = (props: Props) => {
    const { opened, options, onSelect, width = '100%', theme = DROPDOWN_THEMES.DEFAULT, shrinkOutOfBounds } = props;
    const [inverted, setInverted] = useState(false);
    const [outOfRightBounds, setOutOfRightBounds] = useState(false);
    const [visible, setVisible] = useState(opened);
    const [dropdownHeight, setDropdownHeight] = useState('fit-content');

    const ref = useRef(null);

    useOnClickOutside(ref, () => setVisible(false));

    useEffect(() => {
        const bounds = (ref.current as any).getBoundingClientRect();
        const height = window.innerHeight || document.documentElement.clientHeight;
        const width = window.innerWidth || document.documentElement.clientWidth;

        if (bounds.bottom > height && !shrinkOutOfBounds) {
            setInverted(true);
        }

        if (bounds.right > width && !shrinkOutOfBounds) {
            setOutOfRightBounds(true);
        }

        if (shrinkOutOfBounds && bounds.bottom > height) {
            setDropdownHeight(`${height - bounds.top}px`);
        }
    }, [setInverted, visible]);

    useEffect(() => {
        setVisible(opened);
    }, [opened]);

    const className = classNames(styles.dropdown, {
        [styles.opened]: visible,
        [styles.inverted]: inverted && !outOfRightBounds,
        [styles.default]: theme === DROPDOWN_THEMES.DEFAULT,
        [styles.outOfRightBounds]: outOfRightBounds && !inverted,
        [styles.outOfAllBounds]: outOfRightBounds && inverted
    });

    return (
        <div className={className} style={{ width, height: dropdownHeight }} ref={ref}>
            {options.map((option) => (
                <DropdownOption
                    theme={theme}
                    short={option.short}
                    key={option.value}
                    onClick={() => onSelect(option.value)}
                >
                    {option.text}
                </DropdownOption>
            ))}
        </div>
    );
};

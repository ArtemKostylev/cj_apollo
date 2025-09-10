import type { PropsWithChildren } from 'react';
import styles from './dropdownOption.module.css';
import classNames from 'classnames';
import type { DropdownTheme } from './dropdownTheme';
import { DROPDOWN_THEMES } from './dropdownTheme';

interface Props {
    short?: boolean;
    onClick: () => void;
    theme?: DropdownTheme;
}

export const DropdownOption = (props: PropsWithChildren<Props>) => {
    const { children, short, onClick, theme = DROPDOWN_THEMES.DEFAULT } = props;

    const className = classNames(styles.option, {
        [styles.short]: short,
        [styles.default]: theme === DROPDOWN_THEMES.DEFAULT,
        [styles.control]: theme === DROPDOWN_THEMES.CONTROL
    });

    return (
        <span className={className} onClick={onClick}>
            {children}
        </span>
    );
};

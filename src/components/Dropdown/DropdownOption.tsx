import type { PropsWithChildren } from 'react';
import styles from './dropdownOption.module.css';
import classNames from 'classnames';

interface Props {
    short?: boolean;
    onClick: () => void;
}

export const DropdownOption = (props: PropsWithChildren<Props>) => {
    const { children, short, onClick } = props;

    const className = classNames(styles.option, {
        [styles.short]: short
    });

    return (
        <span className={className} onClick={onClick}>
            {children}
        </span>
    );
};

import type { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './button.module.css';

interface Props {
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
}

export const Button = (props: PropsWithChildren<Props>) => {
    const {
        children,
        onClick,
        type,
        className: externalClassName,
        disabled
    } = props;

    const className = classNames(styles.button, externalClassName);

    return (
        <button
            onClick={onClick}
            type={type}
            className={className}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

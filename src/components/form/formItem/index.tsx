import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './formItem.module.css';

interface FormItemProps {
    className?: string;
    label: string;
    error?: string;
}

export function FormItem(props: PropsWithChildren<FormItemProps>) {
    const { className: externalClassName, label, error, children } = props;

    const className = classNames(styles.formItem, externalClassName, {
        [styles.error]: error
    });

    const errorTextClassName = classNames(styles.errorText, {
        [styles.hiddenError]: !error
    });

    return (
        <div className={className}>
            <label>{label}</label>
            {children}
            <span className={errorTextClassName}>{error}</span>
        </div>
    );
}

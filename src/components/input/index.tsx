import { forwardRef, InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { className, error, ...rest } = props;
    const inputClassName = classNames(styles.input, className, {
        [styles.error]: error
    });

    return <input ref={ref} {...rest} className={inputClassName} />;
});

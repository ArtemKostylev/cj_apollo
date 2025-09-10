import { forwardRef, SelectHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './select.module.css';
import { DropdownOptionType } from '~/models/dropdownOption';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
    options: DropdownOptionType[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
    const { className, error, options, ...rest } = props;
    const selectClassName = classNames(styles.select, className, {
        [styles.error]: error
    });

    return (
        <select ref={ref} {...rest} className={selectClassName}>
            <option value=" ">Выберите значение</option>
            {options.map((it) => (
                <option key={it.value} value={it.value}>
                    {it.text}
                </option>
            ))}
        </select>
    );
});

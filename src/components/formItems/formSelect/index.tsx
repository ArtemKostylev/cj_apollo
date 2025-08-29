import { BaseFormItemProps } from '../types';
import { Label } from '../label';
import styles from './select.module.css';
import formStyles from '../formItem.module.css';
import { useCallback } from 'react';

interface FormSelectProps extends BaseFormItemProps {
    options?: DropdownOptionType[];
}

export const FormSelect = (props: FormSelectProps) => {
    const { name, value = ' ', onChange, label, options, required } = props;

    const onChangeInternal = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            onChange(name, e.target.value);
        },
        [onChange, name]
    );

    return (
        <div className={formStyles.formItem}>
            <Label htmlFor={name}>{label}:</Label>
            <select
                className={styles.select}
                id={name}
                name={name}
                value={value}
                onChange={onChangeInternal}
                required={required}
            >
                <option value=" ">Выберите значение</option>
                {Array.from(options?.values() || []).map((it) => (
                    <option key={it.value} value={it.value}>
                        {it.text}
                    </option>
                ))}
            </select>
        </div>
    );
};

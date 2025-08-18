import { Label } from '../label';
import formStyles from './formItem.module.css';
import styles from './formInput.module.css';
import type { BaseFormItemProps } from '../types';

interface InputProps extends BaseFormItemProps {
    type?: string;
    children?: any;
}

export const Input = ({
    name,
    value,
    onChange,
    label,
    type = 'text',
    children,
    required
}: InputProps) => (
    <div className={formStyles.formItem}>
        <Label htmlFor={name}>{label}:</Label>
        <input
            className={styles.formInput}
            name={name}
            type={type}
            id={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            required={required}
        >
            {children}
        </input>
    </div>
);

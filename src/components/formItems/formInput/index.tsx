import { Label } from '../label';
import formStyles from '../formItem.module.css';
import styles from './formInput.module.css';
import type { BaseFormItemProps } from '../types';

interface InputProps extends BaseFormItemProps {
    type?: string;
    children?: any;
    disabled?: boolean;
    placeholder?: string;
    size?: number;
}

export const FormInput = ({
    name,
    value,
    onChange,
    label,
    type = 'text',
    children,
    required,
    disabled,
    placeholder,
    size
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
            disabled={disabled}
            placeholder={placeholder}
            style={{ width: size }}
        >
            {children}
        </input>
    </div>
);

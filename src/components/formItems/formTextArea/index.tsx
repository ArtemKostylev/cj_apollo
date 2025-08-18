import { Label } from '../label';
import formStyles from './formItem.module.css';
import styles from './formTextArea.module.css';
import type { BaseFormItemProps } from '../types';

interface TextAreaProps extends BaseFormItemProps {
    rows?: number;
}

export const TextArea = ({
    name,
    label,
    value,
    onChange,
    rows,
    required
}: TextAreaProps) => (
    <div className={formStyles.formItem}>
        <Label htmlFor={name}>{label}</Label>
        <textarea
            className={styles.formTextArea}
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            rows={rows}
            id={name}
            required={required}
        />
    </div>
);

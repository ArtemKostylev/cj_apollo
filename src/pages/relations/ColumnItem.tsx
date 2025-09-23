import { useState, type ChangeEvent, type MouseEvent } from 'react';
import classNames from 'classnames';
import styles from './relations.module.css';

interface Props {
    text: string;
    editEnabled?: boolean;
    active: boolean;
    selected: boolean;
    clickable: boolean;
    onChange?: (value: boolean) => void;
    onClick?: VoidFunction;
    archived?: boolean;
}

export const ColumnItem = (props: Props) => {
    const { text, editEnabled, active, selected, clickable, onChange, onClick, archived } = props;
    const [checked, setChecked] = useState(active && !archived);

    const className = classNames(styles.item, {
        [styles.active]: active,
        [styles.clickable]: clickable,
        [styles.selected]: selected,
        [styles.inactive]: !active,
        [styles.editEnabled]: editEnabled,
        [styles.archived]: archived
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const value = e.target.checked;
        setChecked(value);
        onChange?.(value);
    };

    const handleInputClick = (e: MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
    };

    return (
        <div key={text} className={className} onClick={() => !archived && onClick?.()}>
            <span>
                {text}
                {archived && ' (А)'}
            </span>
            {editEnabled && (
                <input type="checkbox" checked={checked} onChange={handleChange} onClick={handleInputClick} />
            )}
        </div>
    );
};

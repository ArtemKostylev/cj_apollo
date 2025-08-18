import { ChangeEvent, useState } from 'react';
import styles from './subgroups.module.css';

interface SubgroupItemProps {
    relationId: number;
    subgroup: number;
    studentName: string;
    onChange: (relationId: number, subgroup: number) => void;
}

export const SubgroupItem = (props: SubgroupItemProps) => {
    const { relationId, subgroup, studentName, onChange } = props;
    const [value, setValue] = useState(String(subgroup));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
        onChange(relationId, value.length > 0 ? parseInt(value) : 0);
    };

    return (
        <div className={styles.item}>
            <span>{studentName}</span>
            <span>Группа:</span>
            <input value={value} onChange={handleChange} maxLength={1} />
        </div>
    );
};

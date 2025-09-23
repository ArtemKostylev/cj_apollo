import type { TeacherForRelations } from '~/models/teacher';
import styles from '../relations.module.css';
import { ColumnItem } from '../ColumnItem';

interface Props {
    teachers: TeacherForRelations[];
    selectedTeacher: number | undefined;
    onTeacherClick: (id: number) => void;
}

export const TeacherColumn = (props: Props) => {
    const { teachers, selectedTeacher, onTeacherClick } = props;

    return (
        <div className={styles.column}>
            <div className={styles.columnHeader}>
                <span className={styles.title}>Учителя</span>
            </div>
            <div className={styles.columnContent}>
                {teachers.map((teacher) => {
                    const selected = selectedTeacher === teacher.id;
                    const onClick = () => onTeacherClick?.(teacher.id);
                    return (
                        <ColumnItem
                            key={teacher.id}
                            text={teacher.teacherName}
                            active={true}
                            selected={selected}
                            clickable={true}
                            onClick={onClick}
                        />
                    );
                })}
            </div>
        </div>
    );
};

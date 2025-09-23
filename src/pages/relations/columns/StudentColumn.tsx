import type { ChangedRelation, RelationStudent } from '~/models/relation';
import styles from '../relations.module.css';
import type { StudentGroupForRelations } from '~/models/student';
import { Pencil } from '~/components/icon/Pencil';
import { Check } from '~/components/icon/Check';
import { ColumnItem } from '../ColumnItem';
import { StudentGroup } from '../StudentGroup';
import { useCallback, useRef } from 'react';
import { Spinner } from '~/components/spinner';

interface Props {
    studentGroups: StudentGroupForRelations[];
    activeStudentIds: RelationStudent[];
    selectedCourse: number | undefined;
    selectedTeacher: number | undefined;
    editEnabled: boolean;
    onEdit: () => void;
    onSave: (values: ChangedRelation[]) => void;
    isPending: boolean;
    disabled: boolean;
}

export const StudentColumn = (props: Props) => {
    const {
        studentGroups,
        activeStudentIds,
        selectedCourse,
        selectedTeacher,
        editEnabled,
        onEdit,
        onSave: onSaveProp,
        isPending,
        disabled
    } = props;

    const changedRelations = useRef<Record<number, ChangedRelation>>({});

    const onChange = useCallback(
        (studentId: number, checked: boolean) => {
            changedRelations.current[studentId] = {
                teacherId: selectedTeacher!,
                courseId: selectedCourse!,
                studentId,
                checked
            };
        },
        [selectedTeacher, selectedCourse]
    );

    const onSave = useCallback(() => {
        onSaveProp(Object.values(changedRelations.current));
    }, [onSaveProp]);

    return (
        <div className={styles.column}>
            <div className={styles.columnHeader}>
                <span className={styles.title}>Учащиеся</span>
                {isPending && <Spinner />}
                {!isPending && !editEnabled && !disabled && <Pencil onClick={onEdit} className={styles.icon} />}
                {!isPending && editEnabled && <Check onClick={onSave} className={styles.icon} />}
            </div>
            <div className={styles.columnContent}>
                <>
                    {studentGroups.map((studentGroup) => {
                        const students = studentGroup.students.filter((student) =>
                            activeStudentIds.find((activeStudent) => activeStudent.id === student.id)
                        );

                        if (!students.length) {
                            return null;
                        }

                        return (
                            <div key={studentGroup.group}>
                                <StudentGroup group={studentGroup.group} />
                                <div>
                                    {students.map((student) => (
                                        <ColumnItem
                                            key={student.id}
                                            text={student.name}
                                            editEnabled={editEnabled}
                                            active={true}
                                            archived={
                                                activeStudentIds.find(
                                                    (activeStudent) => activeStudent.id === student.id
                                                )?.archived
                                            }
                                            selected={false}
                                            clickable={false}
                                            onChange={(checked) => onChange(student.id, checked)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </>
                <>
                    {studentGroups.map((studentGroup) => {
                        const students = studentGroup.students.filter(
                            (student) => !activeStudentIds.find((activeStudent) => activeStudent.id === student.id)
                        );

                        if (!students.length) {
                            return null;
                        }

                        return (
                            <div key={studentGroup.group}>
                                <StudentGroup group={studentGroup.group} />
                                <div>
                                    {students.map((student) => (
                                        <ColumnItem
                                            key={student.id}
                                            text={student.name}
                                            editEnabled={editEnabled}
                                            active={false}
                                            selected={false}
                                            clickable={false}
                                            onChange={(checked) => onChange(student.id, checked)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </>
            </div>
        </div>
    );
};

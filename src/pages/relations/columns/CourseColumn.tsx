import type { CourseForRelations } from '~/models/course';
import styles from '../relations.module.css';
import type { ResponseWithIds } from '~/models/responseWithIds';
import { Check } from '~/components/icon/Check';
import { Pencil } from '~/components/icon/Pencil';
import { ColumnItem } from '../ColumnItem';
import { useCallback, useRef } from 'react';
import type { ChangedRelation } from '~/models/relation';
import { Spinner } from '~/components/spinner';

interface Props {
    allCourses: ResponseWithIds<CourseForRelations>;
    activeCourses:
        | {
              id: number;
              archived: boolean;
          }[]
        | undefined;
    selectedTeacher: number | undefined;
    selectedCourse: number | undefined;
    onCourseClick: (id: number) => void;
    editEnabled: boolean;
    onEdit: () => void;
    onSave: (values: ChangedRelation[]) => void;
    disabled: boolean;
    isPending: boolean;
}

export const CourseColumn = (props: Props) => {
    const {
        allCourses,
        activeCourses,
        selectedCourse,
        selectedTeacher,
        onCourseClick,
        editEnabled,
        onEdit,
        onSave: onSaveProp,
        disabled,
        isPending
    } = props;
    const { data, ids } = allCourses;

    const changedRelations = useRef<Record<number, ChangedRelation>>({});

    const onChange = useCallback(
        (courseId: number, checked: boolean) => {
            changedRelations.current[courseId] = {
                teacherId: selectedTeacher!,
                courseId,
                checked
            };
        },
        [selectedTeacher]
    );

    const onSave = useCallback(() => {
        onSaveProp(Object.values(changedRelations.current));
    }, [onSaveProp]);

    return (
        <div className={styles.column}>
            <div className={styles.columnHeader}>
                <span className={styles.title}>Учебные предметы</span>
                {isPending && <Spinner />}
                {!isPending && !editEnabled && !disabled && <Pencil onClick={onEdit} className={styles.icon} />}
                {!isPending && editEnabled && <Check onClick={onSave} className={styles.icon} />}
            </div>
            <div className={styles.columnContent}>
                {activeCourses && (
                    <div>
                        {activeCourses?.map((course) => {
                            const item = data[course.id];
                            const selected = selectedCourse === course.id;
                            const onClick = () => onCourseClick?.(course.id);
                            return (
                                <ColumnItem
                                    key={item.id}
                                    text={item.courseName}
                                    editEnabled={editEnabled}
                                    active={true}
                                    selected={selected}
                                    archived={course.archived}
                                    clickable={true}
                                    onClick={onClick}
                                    onChange={(checked) => onChange(course.id, checked)}
                                />
                            );
                        })}
                    </div>
                )}
                <div>
                    {ids.map((id) => {
                        if (activeCourses?.some((course) => course.id === id)) {
                            return null;
                        }
                        const item = data[id];
                        return (
                            <ColumnItem
                                key={item.id}
                                text={item.courseName}
                                editEnabled={editEnabled}
                                active={false}
                                selected={false}
                                clickable={false}
                                onChange={(checked) => onChange(id, checked)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

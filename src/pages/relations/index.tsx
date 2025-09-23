import { useCallback, useMemo, useState } from 'react';
import { PageWrapper } from '~/components/pageWrapper';
import { useRelationsData } from './useRelationsData';
import { PageLoader } from '~/components/pageLoader';
import styles from './relations.module.css';
import { CourseColumn } from './columns/CourseColumn';
import { StudentColumn } from './columns/StudentColumn';
import { TeacherColumn } from './columns/TeacherColumn';
import type { ChangedRelation } from '~/models/relation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCourseRelations, updateStudentRelations } from '~/api/relations';

export const Relations = () => {
    const [coursesEditEnabled, setCoursesEditEnabled] = useState(false);
    const [studentsEditEnabled, setStudentsEditEnabled] = useState(false);

    const [selectedTeacher, setSelectedTeacher] = useState<number | undefined>(undefined);
    const [selectedCourse, setSelectedCourse] = useState<number | undefined>(undefined);

    const queryClient = useQueryClient();

    const { teachers, courses, students, relations, loading, error } = useRelationsData();

    const { mutate: updateStudentRelationsMutation, isPending: isUpdateStudentRelationsPending } = useMutation({
        mutationFn: updateStudentRelations,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['relations'] });
        }
    });

    const { mutate: updateCourseRelationsMutation, isPending: isUpdateCourseRelationsPending } = useMutation({
        mutationFn: updateCourseRelations,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['relations'] });
        }
    });

    const activeCourses = useMemo(() => {
        if (!selectedTeacher) {
            return undefined;
        }
        const activeRelation = relations[selectedTeacher];
        return activeRelation?.courses ?? [];
    }, [relations, selectedTeacher]);

    const activeStudentIds = useMemo(() => {
        if (!selectedCourse || !selectedTeacher) {
            return [];
        }
        const activeRelation = relations[selectedTeacher];
        const activeCourse = activeRelation?.coursesById[selectedCourse];
        return activeCourse?.students ?? [];
    }, [relations, selectedCourse, selectedTeacher]);

    const onTeacherClick = useCallback(
        (id: number) => {
            if (studentsEditEnabled || coursesEditEnabled) {
                return;
            }
            setSelectedTeacher(id);
            setSelectedCourse(undefined);
            setStudentsEditEnabled(false);
            setCoursesEditEnabled(false);
        },
        [studentsEditEnabled, coursesEditEnabled]
    );

    const onCourseClick = useCallback(
        (id: number) => {
            if (studentsEditEnabled || coursesEditEnabled) {
                return;
            }
            setSelectedCourse(id);
        },
        [studentsEditEnabled, coursesEditEnabled]
    );

    const onCourseEdit = useCallback(() => {
        setCoursesEditEnabled(true);
    }, []);

    const onStudentEdit = useCallback(() => {
        setStudentsEditEnabled(true);
    }, []);

    const onCourseSave = useCallback((values: ChangedRelation[]) => {
        updateCourseRelationsMutation(values);
        setCoursesEditEnabled(false);
    }, []);

    const onStudentSave = useCallback((values: ChangedRelation[]) => {
        updateStudentRelationsMutation(values);
        setStudentsEditEnabled(false);
    }, []);

    return (
        <PageWrapper>
            <PageLoader loading={loading} error={error} />
            <div className={styles.container}>
                {teachers && (
                    <TeacherColumn
                        teachers={teachers}
                        selectedTeacher={selectedTeacher}
                        onTeacherClick={onTeacherClick}
                    />
                )}
                {courses && (
                    <CourseColumn
                        allCourses={courses}
                        activeCourses={activeCourses}
                        selectedCourse={selectedCourse}
                        selectedTeacher={selectedTeacher}
                        onCourseClick={onCourseClick}
                        editEnabled={coursesEditEnabled}
                        onEdit={onCourseEdit}
                        onSave={onCourseSave}
                        disabled={!selectedTeacher || !!selectedCourse}
                        isPending={isUpdateCourseRelationsPending}
                    />
                )}
                {students && (
                    <StudentColumn
                        studentGroups={students}
                        activeStudentIds={activeStudentIds}
                        selectedCourse={selectedCourse}
                        selectedTeacher={selectedTeacher}
                        editEnabled={studentsEditEnabled}
                        onEdit={onStudentEdit}
                        onSave={onStudentSave}
                        disabled={!selectedCourse}
                        isPending={isUpdateStudentRelationsPending}
                    />
                )}
            </div>
        </PageWrapper>
    );
};

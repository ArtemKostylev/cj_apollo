import { useState, useMemo, useCallback, useRef } from 'react';
import { useUserData } from '../../../hooks/useUserData';
import { TableControls } from '~/components/tableControls';
import { getCurrentAcademicYear } from '../../../utils/academicDate';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSubgroups, saveSubgroups } from '../../../api/subgroup';
import { LegacySpinner } from '~/components/LegacySpinner';
import { SubgroupItem } from './SubgroupItem';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import { ControlButton } from '~/components/tableControls/controlButton';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { PageWrapper } from '~/components/PageWrapper';
import styles from './subgroups.module.css';

export const Subgroups = () => {
    const { user } = useUserData();
    const year = useMemo(() => getCurrentAcademicYear(), []);

    const changedSubgroups = useRef<Record<number, number>>({});

    const currentVersion = user.versions[year];
    const { coursesById, courses: allCourses } = currentVersion;

    const courses = allCourses.filter((it) => it.group);

    const [course, setCourse] = useState(0);

    const teacherId = currentVersion.id;
    const courseId = coursesById[course].id;

    const getCourse = (course: string | number) => {
        setCourse(course as number);
    };

    const { data, isPending, isError } = useQuery({
        queryKey: ['subgroups', courseId, teacherId],
        queryFn: () => getSubgroups(courseId, teacherId)
    });

    const updateSubgroups = useMutation({
        mutationFn: saveSubgroups
    });

    const save = useCallback(() => {
        const subgroups = Object.entries(changedSubgroups.current).map(
            ([relationId, subgroups]) => ({
                relationId: parseInt(relationId),
                subgroup: subgroups
            })
        );
        updateSubgroups.mutate(subgroups);
    }, [changedSubgroups, updateSubgroups]);

    const handleSubgroupChange = useCallback(
        (relationId: number, subgroup: number) => {
            changedSubgroups.current[relationId] = subgroup;
        },
        []
    );

    if (isPending) return <LegacySpinner />;
    if (isError) throw new Error('503');

    return (
        <PageWrapper>
            <TableControls>
                <ControlSelect
                    options={toSelectOptions(courses, 'id', 'name')}
                    buttonText={coursesById[course].name}
                    onSelect={getCourse}
                />
                <ControlButton
                    text="Сохранить"
                    onClick={save}
                    disabled={updateSubgroups.isPending}
                />
            </TableControls>
            <div className={styles.groupWrapper}>
                <ul className={styles.groupList}>
                    {data.map((subgroup) => (
                        <>
                            <li className={styles.groupHeader}>
                                Класс: {subgroup.subgroupName}
                            </li>
                            {subgroup.students.map((item) => (
                                <SubgroupItem
                                    key={item.relationId}
                                    relationId={item.relationId}
                                    subgroup={item.subgroup}
                                    studentName={item.studentName}
                                    onChange={handleSubgroupChange}
                                />
                            ))}
                        </>
                    ))}
                </ul>
            </div>
        </PageWrapper>
    );
};

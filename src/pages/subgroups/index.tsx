import { useCallback, useRef } from 'react';
import { useUserData } from '../../hooks/useUserData';
import { TableControls } from '~/components/tableControls';
import { getCurrentAcademicYear } from '../../utils/academicDate';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSubgroups, saveSubgroups } from '../../api/subgroup';
import { SubgroupItem } from './SubgroupItem';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import { ControlButton } from '~/components/tableControls/controlButton';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { PageWrapper } from '~/components/pageWrapper';
import styles from './subgroups.module.css';
import { PageLoader } from '~/components/PageLoader';
import { useBlockPageLeave } from '~/hooks/useBlockPageLeave';
import { useFilter } from '~/hooks/useFilter';

export const Subgroups = () => {
    const { userData } = useUserData();
    const year = getCurrentAcademicYear();

    const changedSubgroups = useRef<Record<number, number>>({});
    useBlockPageLeave(changedSubgroups.current);

    const currentVersion = userData.versions[year];
    const { coursesById, groupCourses } = currentVersion;

    const [course, setCourse] = useFilter<number>(groupCourses[0].id, 'course', (val) => Number(val) as number);

    const getCourse = (course: string | number) => {
        setCourse(course as number);
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['subgroups', course, currentVersion.teacherId],
        queryFn: () => getSubgroups(course, currentVersion.teacherId)
    });

    const { mutate: updateSubgroups, isPending } = useMutation({
        mutationFn: saveSubgroups,
        onSuccess: () => {
            changedSubgroups.current = {};
        }
    });

    const save = useCallback(() => {
        const subgroups = Object.entries(changedSubgroups.current).map(([relationId, subgroups]) => ({
            relationId: parseInt(relationId),
            subgroup: subgroups
        }));
        updateSubgroups(subgroups);
    }, [changedSubgroups, updateSubgroups]);

    const handleSubgroupChange = useCallback((relationId: number, subgroup: number) => {
        changedSubgroups.current[relationId] = subgroup;
    }, []);

    const saveButtonDisabled = isPending || isLoading;

    return (
        <PageWrapper>
            <TableControls>
                <ControlSelect
                    options={toSelectOptions(groupCourses, 'id', 'name')}
                    buttonText={coursesById[course].name}
                    onSelect={getCourse}
                />
                <ControlButton text="Сохранить" onClick={save} disabled={saveButtonDisabled} loading={isPending} />
            </TableControls>
            <PageLoader loading={isLoading} error={isError}>
                <div className={styles.groupWrapper}>
                    {data?.map((subgroup) => (
                        <>
                            <div className={styles.groupHeader}>Класс: {subgroup.subgroupName}</div>
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
                </div>
            </PageLoader>
        </PageWrapper>
    );
};

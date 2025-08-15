import { useMutation, useQuery } from '@tanstack/react-query';
import { getConsults, updateConsults } from '../../../api/consult';
import { useUserData } from '../../../hooks/useUserData';
import { getCurrentAcademicYear } from '../../../utils/academicDate';
import { useMemo, useRef, useState } from 'react';
import { LegacySpinner } from '../../../ui/LegacySpinner';
import { TableControlType } from '../../../ui/TableControls';

interface UpdatedConsult {
    clientId: string;
    id: number | undefined;
    date: string;
    hours: number | undefined;
    relationId: number;
    year: number;
}

export const Consults = () => {
    const { user } = useUserData();
    const [year, setYear] = useState(getCurrentAcademicYear());
    const [course, setCourse] = useState(0);

    const currentVersion = user.versions[year];
    const courses = currentVersion.courses;

    const changedConsults = useRef<Record<string, UpdatedConsult>>({});

    const onCellValueChange = (consult: UpdatedConsult) => {
        changedConsults.current[consult.clientId] = consult;
    };

    const {
        data: consults,
        isLoading: isConsultsLoading,
        isError: isConsultsError
    } = useQuery({
        queryKey: ['consults'],
        queryFn: () =>
            getConsults({
                courseId: currentVersion.id,
                teacherId: courses[course].id,
                year: year
            })
    });

    const { isPending: isUpdatePending, mutate: updateConsultsMutation } = useMutation({
        mutationFn: () => {
            const data = Object.values(changedConsults.current).map((consult) => ({
                id: consult.id,
                date: consult.date,
                hours: consult.hours,
                relationId: consult.relationId,
                year: year
            }));

            return updateConsults({
                consults: data
            });
        }
    });

    const consultControls = useMemo(() => {
        return [
            {
                type: TableControlType.SELECT,
                options: new Map(
                    userCourses.map((it, index) => [
                        index,
                        { value: index, text: it.name },
                    ])
                ),
                text: userCourses[course].name,
                onClick: onCourseChange,
            },
            {
                type: TableControlType.SELECT,
                options: YEARS,
                text: YEARS.get(currentYear)?.text,
                onClick: onYearChange,
            },
            {
                type: TableControlType.BUTTON,
                text: "Сохранить",
                onClick: save,
            },
        ];
    }, []);

    if (isConsultsLoading) return <LegacySpinner />;
    if (isConsultsError) throw new Error('503');

    return <div>Consults</div>;
};

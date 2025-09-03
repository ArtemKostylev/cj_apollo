import { useUserData } from '../../hooks/useUserData';
import { TableControls } from '~/components/tableControls';
import { PageWrapper } from '~/components/pageWrapper';
import { useCallback, useEffect, useState } from 'react';
import { AcademicYears, YEARS, YEARS_NAMES } from '../../constants/date';
import { getCurrentAcademicYear } from '../../utils/academicDate';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getNote, updateNote } from '../../api/note';

import styles from './notes.module.css';
import { ControlButton } from '~/components/tableControls/controlButton';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { PageLoader } from '~/components/PageLoader';

export const Notes = () => {
    const { userData } = useUserData();
    const [year, setYear] = useState(getCurrentAcademicYear());

    const currentVersion = userData.versions[year];
    const { coursesById, allCourses } = currentVersion;

    const [course, setCourse] = useState(allCourses[0].id);

    const [value, setValue] = useState('');

    const onYearChange = useCallback((year: string | number) => {
        setYear(year as AcademicYears);
    }, []);

    const onCourseChange = useCallback((course: string | number) => {
        setCourse(course as number);
    }, []);

    const onTextAreaValueChange = useCallback((e: any) => {
        setValue(e.target.value);
    }, []);

    const { mutate: update, isPending } = useMutation({ mutationFn: updateNote });

    const onSave = useCallback(() => {
        update({
            noteId: data?.id || 0,
            text: value,
            teacherId: currentVersion.teacherId,
            courseId: coursesById[course].id,
            year
        });
    }, []);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['note'],
        queryFn: () =>
            getNote({
                courseId: coursesById[course].id,
                teacherId: currentVersion.teacherId,
                year
            })
    });

    useEffect(() => {
        data?.text && setValue(data?.text);
    }, [data?.text]);

    return (
        <PageWrapper>
            <TableControls>
                <ControlSelect
                    options={toSelectOptions(allCourses, 'id', 'name')}
                    buttonText={coursesById[course].name}
                    onSelect={onCourseChange}
                />
                <ControlSelect options={YEARS} buttonText={YEARS_NAMES[year]} onSelect={onYearChange} />
                <ControlButton text="Сохранить" onClick={onSave} disabled={isPending} />
            </TableControls>
            <PageLoader loading={isLoading} error={isError}>
                <textarea
                    className={styles.notesTextarea}
                    placeholder="Это - место для заметок..."
                    value={value}
                    onChange={onTextAreaValueChange}
                />
            </PageLoader>
        </PageWrapper>
    );
};

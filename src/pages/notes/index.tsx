import { useUserData } from '../../hooks/useUserData';
import { TableControls } from '~/components/tableControls';
import { PageWrapper } from '~/components/pageWrapper';
import { useCallback, useEffect, useState } from 'react';
import { AcademicYears, YEARS, YEARS_NAMES } from '../../constants/date';
import { getCurrentAcademicYear } from '../../utils/academicDate';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getNote, updateNote } from '../../api/note';
import { LegacySpinner } from '~/components/LegacySpinner';

import styles from './notes.module.css';
import { ControlButton } from '~/components/tableControls/controlButton';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import { toSelectOptions } from '~/utils/toSelectOptions';

export const Notes = () => {
    const { user } = useUserData();
    const [year, setYear] = useState(getCurrentAcademicYear());

    const currentVersion = user.versions[year];
    const { coursesById, courses } = currentVersion;

    const [course, setCourse] = useState(courses[0].id);

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

    const update = useMutation({ mutationFn: updateNote });

    const onSave = useCallback(() => {
        update.mutate({
            noteId: data?.id || 0,
            text: value,
            teacherId: currentVersion.id,
            courseId: coursesById[course].id,
            year
        });
    }, []);

    const { data, isPending, isError } = useQuery({
        queryKey: ['note'],
        queryFn: () =>
            getNote({
                courseId: coursesById[course].id,
                teacherId: currentVersion.id,
                year
            })
    });

    useEffect(() => {
        data?.text && setValue(data?.text);
    }, [data?.text]);

    if (isPending) return <LegacySpinner />;
    if (isError) throw new Error('503');

    return (
        <PageWrapper>
            <TableControls>
                <ControlSelect
                    options={toSelectOptions(courses, 'id', 'name')}
                    buttonText={coursesById[course].name}
                    onSelect={onCourseChange}
                />
                <ControlSelect
                    options={YEARS}
                    buttonText={YEARS_NAMES[year]}
                    onSelect={onYearChange}
                />
                <ControlButton
                    text="Сохранить"
                    onClick={onSave}
                    disabled={update.isPending}
                />
            </TableControls>
            <textarea
                className={styles.notesTextarea}
                placeholder="Это - место для заметок..."
                value={value}
                onChange={onTextAreaValueChange}
            />
        </PageWrapper>
    );
};

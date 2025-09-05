import { Fragment, useCallback, useMemo, useRef } from 'react';
import { useUserData } from '~/hooks/useUserData';
import { TableControls } from '~/components/tableControls';
import { MONTHS_NAMES, MONTHS_RU, YEARS, YEARS_NAMES, type AcademicYears, type Months } from '~/constants/date';
import { getCurrentAcademicMonth, getCurrentAcademicYear } from '~/utils/academicDate';
import { TableCell } from '~/components/cells/tableCell';
import { PageWrapper } from '~/components/pageWrapper';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { ControlButton } from '~/components/tableControls/controlButton';
import styles from './compensation.module.css';
import { TableHeader } from '~/components/table/tableHeader';
import { NameHeader } from '~/components/table/nameHeader';
import { Table } from '~/components/table';
import { getReplacementList, updateReplacements } from '~/api/replacement';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PageLoader } from '~/components/PageLoader';
import { ChangedReplacement } from '~/models/replacement';
import { NameCell } from '~/components/cells/nameCell';
import { DateCell } from '~/components/cells/dateCell';
import { useBlockPageLeave } from '~/hooks/useBlockPageLeave';
import { useFilter } from '~/hooks/useFilter';

export const Compensation = () => {
    let { userData } = useUserData();

    const [year, setYear] = useFilter<AcademicYears>(
        getCurrentAcademicYear(),
        'year',
        (val) => Number(val) as AcademicYears
    );
    const [month, setMonth] = useFilter<Months>(getCurrentAcademicMonth(), 'month', (val) => val as Months);

    const currentVersion = useMemo(() => userData.versions[year], [userData, year]);
    const courses = currentVersion.allCourses;
    const coursesById = currentVersion.coursesById;

    const changedReplacements = useRef<Record<number, ChangedReplacement>>({});
    useBlockPageLeave(changedReplacements.current);

    const [course, setCourse] = useFilter<number>(courses[0].id, 'course', (val) => Number(val) as number);

    const onYearChange = useCallback((year: string | number) => {
        setYear(year as AcademicYears);
    }, []);

    const onCourseChange = useCallback((course: string | number) => {
        setCourse(course as number);
    }, []);

    const onMonthChange = useCallback((month: string | number) => {
        setMonth(month as Months);
    }, []);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['replacementList', year, month, course],
        queryFn: () =>
            getReplacementList({
                year,
                month: Number(month),
                teacherId: currentVersion.teacherId,
                courseId: course
            })
    });

    const { mutate: updateReplacementsMutation, isPending } = useMutation({
        mutationFn: updateReplacements,
        onSuccess: () => {
            changedReplacements.current = {};
        }
    });

    const save = useCallback(() => {
        updateReplacementsMutation(Object.values(changedReplacements.current));
    }, [updateReplacementsMutation]);

    const onDateChange = useCallback((columnId: string, value: string) => {
        const [rowIndex, journalEntryId] = columnId.split('-');
        const journalEntry = data?.rows[Number(rowIndex)].replacements[Number(journalEntryId)];

        if (!journalEntry) {
            throw new Error('Journal entry not found');
        }

        changedReplacements.current[Number(rowIndex)] = {
            id: journalEntry.id ?? 0,
            journalEntryId: journalEntry.journalEntryId,
            date: value
        };
    }, []);

    return (
        <PageWrapper>
            <TableControls>
                <ControlSelect options={MONTHS_RU} buttonText={MONTHS_NAMES[month]} onSelect={onMonthChange} />
                <ControlSelect
                    options={toSelectOptions(courses, 'id', 'name')}
                    buttonText={coursesById?.[course]?.name}
                    onSelect={onCourseChange}
                />
                <ControlSelect options={YEARS} buttonText={YEARS_NAMES[year]} onSelect={onYearChange} />
                <ControlButton text="Сохранить" onClick={save} disabled={isPending} />
            </TableControls>
            <PageLoader loading={isLoading} error={isError}>
                <Table>
                    <thead>
                        <tr>
                            <NameHeader />
                            {Array.from({ length: 10 }, (_, index) => (
                                <Fragment key={index}>
                                    <TableHeader>Пропуск</TableHeader>
                                    <TableHeader>Выдано</TableHeader>
                                </Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.rows.map((row, rowIndex) => (
                            <tr>
                                <NameCell name={row.studentName} archived={row.archived} />
                                {Array.from({ length: 10 }, (_, index) => {
                                    const replacement = Object.values(row.replacements)[index];
                                    return (
                                        <Fragment key={index}>
                                            <TableCell className={styles.lessonCell}>
                                                {replacement?.journalEntryDate}
                                            </TableCell>
                                            <TableCell>
                                                {replacement && (
                                                    <DateCell
                                                        initialValue={replacement.date}
                                                        columnId={`${rowIndex}-${replacement.journalEntryId}`}
                                                        onChange={onDateChange}
                                                        month={month}
                                                        year={year}
                                                    />
                                                )}
                                            </TableCell>
                                        </Fragment>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </PageLoader>
        </PageWrapper>
    );
};

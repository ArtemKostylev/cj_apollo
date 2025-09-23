import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';
import { PageWrapper } from '~/components/pageWrapper';
import { Table } from '~/components/table1';
import { TableControls } from '~/components/tableControls';
import { PageLoader } from '~/components/pageLoader';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import {
    MONTHS_RU,
    type Months,
    type AcademicYears,
    MONTHS_NAMES,
    YEARS,
    YEARS_NAMES,
    DATE_FORMAT
} from '~/constants/date';
import { getCurrentAcademicMonth, getCurrentAcademicYear, getQuartersInMonth } from '~/utils/academicDate';
import { useUserData } from '~/hooks/useUserData';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { ControlButton } from '~/components/tableControls/controlButton';
import { generateDatesForMonth } from './utils';
import { JournalHeader } from './JournalHeader';
import { NameCell } from '~/components/cells/nameCell';
import { TableCell } from '~/components/cells/tableCell';
import type { ChangedMark } from '~/models/mark';
import type { ChangedQuarterMark } from '~/models/quarterMark';
import { MarkCell } from './MarkCell';
import { QuarterMarkCell } from './QuarterMarkCell';
import { getJournal, updateJournal, type UpdateJournalParams } from '~/api/journal';
import { format } from 'date-fns';
import { useBlockPageLeave } from '~/hooks/useBlockPageLeave';
import { useFilter } from '~/hooks/useFilter';

export const Journal = () => {
    const { userData } = useUserData();

    const [month, setMonth] = useFilter<Months>(getCurrentAcademicMonth(), 'month', (value) => value as Months);
    const [year, setYear] = useFilter<AcademicYears>(getCurrentAcademicYear(), 'year', (value) => {
        return Number(value) as AcademicYears;
    });

    const dates = useMemo(() => generateDatesForMonth(month, year), [month, year]);
    const quarters = useMemo(() => getQuartersInMonth(month), [month]);

    const currentVersion = userData.versions[year];
    const { courses, coursesById } = currentVersion;
    const courseSelectOptions = useMemo(() => toSelectOptions(courses, 'id', 'name'), [courses]);

    const [course, setCourse] = useFilter<number>(courses[0].id, 'course', Number);

    const courseHasOnlyHours = !!coursesById[course].onlyHours;

    const changedMarks = useRef<Record<string, ChangedMark>>({});
    const changedQuarterMarks = useRef<Record<string, ChangedQuarterMark>>({});
    useBlockPageLeave(changedMarks.current);
    useBlockPageLeave(changedQuarterMarks.current);

    const onMarkChange = useCallback((clientId: string, mark: ChangedMark) => {
        changedMarks.current[clientId] = mark;
    }, []);

    const onQuarterMarkChange = useCallback((clientId: string, quarterMark: ChangedQuarterMark) => {
        changedQuarterMarks.current[clientId] = quarterMark;
    }, []);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['journal', currentVersion.teacherId, course, year, month],
        networkMode: 'always',
        queryFn: () =>
            getJournal({
                teacherId: currentVersion.teacherId,
                courseId: course,
                year,
                month: Number(month)
            })
    });

    const { mutate: updateJournalMt, isPending } = useMutation({
        mutationFn: (params: UpdateJournalParams) => updateJournal(params),
        onSuccess: () => {
            changedMarks.current = {};
            changedQuarterMarks.current = {};
        }
    });

    const onSave = useCallback(() => {
        updateJournalMt({
            marks: Object.values(changedMarks.current),
            quarterMarks: Object.values(changedQuarterMarks.current)
        });
        changedMarks.current = {};
        changedQuarterMarks.current = {};
    }, [updateJournalMt]);

    const readonly = year !== getCurrentAcademicYear();
    const saveButtonDisabled = isPending || isLoading || readonly;

    return (
        <PageWrapper>
            <TableControls>
                <ControlSelect
                    options={MONTHS_RU}
                    buttonText={MONTHS_NAMES[month]}
                    onSelect={(value) => setMonth(value as Months)}
                />
                <ControlSelect
                    options={courseSelectOptions}
                    buttonText={coursesById[course].name}
                    onSelect={(value) => setCourse(Number(value))}
                />
                <ControlSelect
                    options={YEARS}
                    buttonText={YEARS_NAMES[year]}
                    onSelect={(value) => {
                        setYear(Number(value) as AcademicYears);
                        setCourse(userData.versions[value].courses[0].id);
                    }}
                />
                <ControlButton text="Сохранить" onClick={onSave} disabled={saveButtonDisabled} loading={isPending} />
            </TableControls>
            <PageLoader loading={isLoading} error={isError}>
                <Table>
                    <JournalHeader dates={dates} quarters={quarters} />
                    <tbody>
                        {data?.map((row) => (
                            <tr key={row.relationId}>
                                <NameCell name={row.studentName} archived={row.archived} />
                                <TableCell disabled={row.archived}>{row.class}</TableCell>
                                {dates.map((date) => (
                                    <MarkCell
                                        key={date.toISOString()}
                                        mark={row.marks[format(date, DATE_FORMAT)]}
                                        date={date}
                                        relationId={row.relationId}
                                        onlyHours={courseHasOnlyHours}
                                        archived={row.archived}
                                        onChange={onMarkChange}
                                        readonly={readonly}
                                    />
                                ))}
                                {!courseHasOnlyHours &&
                                    quarters.map((quarter) => (
                                        <QuarterMarkCell
                                            key={quarter}
                                            mark={row.quarterMarks[quarter]}
                                            period={quarter}
                                            year={year}
                                            relationId={row.relationId}
                                            archived={row.archived}
                                            onChange={onQuarterMarkChange}
                                            readonly={readonly}
                                        />
                                    ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </PageLoader>
        </PageWrapper>
    );
};

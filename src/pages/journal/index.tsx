import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';
import { PageWrapper } from '~/components/pageWrapper';
import { Table } from '~/components/table';
import { TableControls } from '~/components/tableControls';
import { Loader } from './Loader';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import {
    MONTHS_RU,
    type Months,
    type AcademicYears,
    MONTHS_NAMES,
    YEARS,
    YEARS_NAMES
} from '~/constants/date';
import {
    getCurrentAcademicMonth,
    getCurrentAcademicYear,
    getQuartersInMonth
} from '~/utils/academicDate';
import { useUserData } from '~/hooks/useUserData';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { ControlButton } from '~/components/tableControls/controlButton';
import { generateDatesForMonth } from './utils';
import { JournalHeader } from './JournalHeader';
import { NameCell } from '~/components/cells/NameCell';
import { TableCell } from '~/components/cells/TableCell';
import { ChangedMark, type ChangedQuarterMark } from './types';
import { MarkCell } from './MarkCell';
import { QuarterMarkCell } from './QuarterMarkCell';
import {
    getJournal,
    updateJournal,
    type UpdateJournalParams
} from '~/api/journal';

export const Journal = () => {
    const { user } = useUserData();

    const [month, setMonth] = useState<Months>(getCurrentAcademicMonth());
    const [year, setYear] = useState<AcademicYears>(getCurrentAcademicYear());

    const dates = useMemo(
        () => generateDatesForMonth(month, year),
        [month, year]
    );
    const quarters = useMemo(() => getQuartersInMonth(month), [month]);

    const currentVersion = user.versions[year];
    const { courses, coursesById } = currentVersion;
    const courseSelectOptions = toSelectOptions(courses, 'id', 'name');

    // TODO: add separation between all courses, group and individual
    const [course, setCourse] = useState<number>(courses[0].id);

    const courseHasOnlyHours = coursesById[course].onlyHours;

    const changedMarks = useRef<Record<string, ChangedMark>>({});
    const changedQuarterMarks = useRef<Record<string, ChangedQuarterMark>>({});

    const onMarkChange = useCallback((clientId: string, mark: ChangedMark) => {
        changedMarks.current[clientId] = mark;
    }, []);

    const onQuarterMarkChange = useCallback(
        (clientId: string, quarterMark: ChangedQuarterMark) => {
            changedQuarterMarks.current[clientId] = quarterMark;
        },
        []
    );

    const { data, isLoading, isError } = useQuery({
        queryKey: ['journal'],
        queryFn: () =>
            getJournal({
                teacherId: currentVersion.id,
                courseId: course,
                year,
                month
            })
    });

    const { mutate: updateJournalMt, isPending } = useMutation({
        mutationFn: (params: UpdateJournalParams) => updateJournal(params)
    });

    const onSave = useCallback(() => {
        updateJournalMt({
            marks: Object.values(changedMarks.current),
            quarterMarks: Object.values(changedQuarterMarks.current)
        });
    }, [updateJournalMt]);

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
                    onSelect={(value) => setCourse(value as number)}
                />
                <ControlSelect
                    options={YEARS}
                    buttonText={YEARS_NAMES[year]}
                    onSelect={(value) => setYear(value as AcademicYears)}
                />
                <ControlButton
                    text="Сохранить"
                    onClick={onSave}
                    disabled={isPending}
                />
            </TableControls>
            <Loader loading={isLoading} error={isError}>
                <Table>
                    <JournalHeader dates={dates} quarters={quarters} />
                    <tbody>
                        {data?.map((row) => (
                            <tr>
                                <NameCell
                                    name={row.studentName}
                                    archived={row.archived}
                                />
                                <TableCell>{row.class}</TableCell>
                                {dates.map((date) => (
                                    <MarkCell
                                        key={date.format()}
                                        mark={row.marks[date.format()]}
                                        date={date}
                                        relationId={row.relationId}
                                        onlyHours={courseHasOnlyHours}
                                        archived={row.archived}
                                        onChange={onMarkChange}
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
                                        />
                                    ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Loader>
        </PageWrapper>
    );
};

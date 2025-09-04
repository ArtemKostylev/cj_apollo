import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';
import { PageLoader } from '~/components/PageLoader';
import { PageWrapper } from '~/components/pageWrapper';
import { TableControls } from '~/components/tableControls';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import { Periods, PERIODS_NAMES, PERIODS_RU, YEARS, YEARS_NAMES, type AcademicYears } from '~/constants/date';
import { useUserData } from '~/hooks/useUserData';
import type { ChangedMark } from '~/models/mark';
import type { ChangedQuarterMark } from '~/models/quarterMark';
import { getCurrentAcademicPeriod, getCurrentAcademicYear } from '~/utils/academicDate';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { ControlButton } from '~/components/tableControls/controlButton';
import { getGroupJournal, updateJournal, type UpdateJournalParams } from '~/api/journal';
import { GroupJournalTable } from './GroupJournalTable';
import { useBlockPageLeave } from '~/hooks/useBlockPageLeave';

export const GroupJournal = () => {
    const { userData } = useUserData();

    const [year, setYear] = useState<AcademicYears>(getCurrentAcademicYear());
    const [period, setPeriod] = useState<Periods>(getCurrentAcademicPeriod());

    const changedMarks = useRef<Record<string, ChangedMark>>({});
    const changedQuarterMarks = useRef<Record<string, ChangedQuarterMark>>({});
    useBlockPageLeave(changedMarks.current);
    useBlockPageLeave(changedQuarterMarks.current);

    const currentVersion = useMemo(() => userData.versions[year], [userData.versions, year]);
    const { groupCourses: courses, coursesById } = currentVersion;
    const courseSelectOptions = useMemo(() => toSelectOptions(courses, 'id', 'name'), [courses]);

    const [course, setCourse] = useState<number>(courses[0].id);

    const courseHasOnlyHours = useMemo(() => {
        return !!coursesById[course].onlyHours;
    }, [coursesById, course]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['groupJournal', currentVersion.teacherId, period, year, course],
        networkMode: 'always',
        queryFn: () =>
            getGroupJournal({
                teacherId: currentVersion.teacherId,
                period,
                courseId: course,
                year
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
    }, [updateJournalMt]);

    const onMarkChange = useCallback((columnId: string, mark: ChangedMark) => {
        changedMarks.current[columnId] = mark;
    }, []);

    const onQuarterMarkChange = useCallback((columnId: string, quarterMark: ChangedQuarterMark) => {
        changedQuarterMarks.current[columnId] = quarterMark;
    }, []);

    const onMarkDateChange = useCallback((columnId: string, mark: ChangedMark) => {
        const changedMark = changedMarks.current[columnId];
        if (changedMark) {
            changedMark.date = mark.date;
        } else {
            changedMarks.current[columnId] = mark;
        }
    }, []);

    return (
        <PageWrapper>
            <TableControls>
                <ControlSelect
                    options={courseSelectOptions}
                    buttonText={coursesById[course].name}
                    onSelect={(value) => setCourse(value as number)}
                />
                <ControlSelect
                    options={PERIODS_RU}
                    buttonText={PERIODS_NAMES[period]}
                    onSelect={(value) => setPeriod(value as Periods)}
                />
                <ControlSelect
                    options={YEARS}
                    buttonText={YEARS_NAMES[year]}
                    onSelect={(value) => {
                        setYear(value as AcademicYears);
                        setCourse(userData.versions[value].groupCourses[0].id);
                    }}
                />
                <ControlButton text="Сохранить" onClick={onSave} disabled={isPending} />
            </TableControls>
            <PageLoader loading={isLoading} error={isError}>
                {data?.map((table, index) => (
                    <GroupJournalTable
                        key={index}
                        table={table}
                        period={period}
                        tableIndex={index.toString()}
                        year={year}
                        onMarkChange={onMarkChange}
                        onMarkDateChange={onMarkDateChange}
                        onQuarterMarkChange={onQuarterMarkChange}
                        onlyHours={courseHasOnlyHours}
                    />
                ))}
            </PageLoader>
        </PageWrapper>
    );
};

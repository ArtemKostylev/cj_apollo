import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { UPDATE_REPLACEMENTS_MUTATION } from '~/graphql/mutations/updateReplacement';
import { FETCH_REPLACEMENTS_QUERY } from '~/graphql/queries/fetchReplacements';
import { useUserData } from '~/hooks/useUserData';
import { DateCellOld } from '~/components/cells/DateCell_old';
import { TableControls } from '~/components/tableControls';
import { useLocation } from '@tanstack/react-router';
import { updateInPosition } from '~/utils/crud';
import {
    MONTHS_NAMES,
    MONTHS_RU,
    SECOND_PERIOD_MONTHS,
    YEARS,
    YEARS_NAMES,
    type AcademicYears,
    type Months
} from '~/constants/date';
import { getCurrentAcademicYear, getCurrentMonth } from '~/utils/academicDate';
import { TableCell } from '~/components/cells/TableCell';
import { NameCell_old } from '~/components/cells/NameCell_old';
import { PageWrapper } from '~/components/pageWrapper';
import { ControlSelect } from '~/components/tableControls/controlSelect';
import { toSelectOptions } from '~/utils/toSelectOptions';
import { ControlButton } from '~/components/tableControls/controlButton';
import type { UpdateDatesProps } from '~/types/updateDatesProps';
import styles from './compensation.module.css';
import { TableHeader } from '~/components/table/tableHeader';
import { NameHeader } from '~/components/table/nameHeader';
import { Table } from '~/components/table';
import type { Course } from '~/models/course';

export const Compensation = () => {
    let { userData } = useUserData();
    const location = useLocation() as any;
    let studentData: TeacherCourseStudent[] = [];

    const [currentYear, setCurrentYear] = useState<AcademicYears>(
        getCurrentAcademicYear()
    );

    const userCourses: Course[] = useMemo(
        () =>
            location.state?.courses || userData.versions[currentYear].courses,
        [location, userData]
    );
    const coursesById = userData.versions[currentYear].coursesById;

    const [course, setCourse] = useState(userCourses[0].id);
    const [month, setMonth] = useState(getCurrentMonth());

    const teacher = useMemo(
        () =>
            location.state?.versions[currentYear].id ||
            userData.versions[currentYear].teacherId,
        [currentYear]
    );

    const year = SECOND_PERIOD_MONTHS.includes(month)
        ? currentYear + 1
        : currentYear;

    const onYearChange = useCallback((year: string | number) => {
        setCurrentYear(year as AcademicYears);
    }, []);

    const onCourseChange = useCallback((course: string | number) => {
        setCourse(course as number);
    }, []);

    const onMonthChange = useCallback((month: string | number) => {
        setMonth(month as Months);
    }, []);

    const { loading, data, error, refetch, networkStatus } = useQuery(
        FETCH_REPLACEMENTS_QUERY,
        {
            variables: {
                teacherId: teacher,
                courseId: userCourses[course].id,
                date_gte: moment()
                    .month(month)
                    .year(year)
                    .clone()
                    .startOf('month')
                    .utc()
                    .format('YYYY-MM-DDTHH:mm:ss.SSS')
                    .concat('Z'),
                date_lte: moment()
                    .month(month)
                    .year(year)
                    .clone()
                    .endOf('month')
                    .utc()
                    .format('YYYY-MM-DDTHH:mm:ss.SSS')
                    .concat('Z'),
                year
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only'
        }
    );

    const [update, { loading: updateLoading }] = useMutation(
        UPDATE_REPLACEMENTS_MUTATION
    );

    const save = async () => {
        const result: { id: number; date: string; entryId: number }[] = [];
        studentData.forEach((student) => {
            student.journalEntry.forEach((mark) => {
                if (mark.replacement)
                    result.push({
                        id: mark.replacement.id,
                        date: mark.replacement.date,
                        entryId: mark.id
                    });
            });
        });

        await update({
            variables: {
                data: result
            }
        });

        refetch();
    };

    if (loading || networkStatus === NetworkStatus.refetch)
        return <div>Загрузка</div>;
    if (error) throw new Error('503');

    data.fetchReplacements.forEach((entry: TeacherCourseStudent) => {
        if (entry.journalEntry.length > 0) {
            studentData.push(entry);
        }
    });

    const updateDates = ({
        date,
        column,
        group,
        row
    }: Omit<UpdateDatesProps, 'hours'> & { group: number }) => {
        const student = studentData.find((item) => item.student.id === row);
        if (!student)
            throw new Error(`Student with index ${row} was not found`);
        const studentIndex = studentData.indexOf(student);
        const mark = student.journalEntry.find((item) => item.id === group);
        const markIndex = mark ? student.journalEntry.indexOf(mark) : -1;

        const newRepl = {
            id: !mark?.replacement ? 0 : column,
            date: date,
            entryId: group
        };

        studentData = updateInPosition(
            studentData,
            [
                { key: 'journalEntry', index: studentIndex },
                { key: 'replacement', index: markIndex }
            ],
            newRepl
        );
    };

    return (
        <PageWrapper>
            <TableControls>
                <ControlSelect
                    options={MONTHS_RU}
                    buttonText={MONTHS_NAMES[month]}
                    onSelect={onMonthChange}
                />
                <ControlSelect
                    options={toSelectOptions(userCourses, 'id', 'name')}
                    buttonText={coursesById?.[course]?.name}
                    onSelect={onCourseChange}
                />
                <ControlSelect
                    options={YEARS}
                    buttonText={YEARS_NAMES[currentYear]}
                    onSelect={onYearChange}
                />
                <ControlButton
                    text="Сохранить"
                    onClick={save}
                    disabled={updateLoading}
                />
            </TableControls>
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
                    {studentData.map((item) => {
                        return (
                            <tr>
                                <NameCell_old
                                    surname={item.student.surname}
                                    name={item.student.name}
                                />
                                {Array.from({ length: 10 }, (_, index) => {
                                    let lesson = null;
                                    let lesson_date = null;
                                    let repl = null;
                                    if (item.journalEntry[index]) {
                                        lesson = item.journalEntry[index];
                                        lesson_date = lesson.date.split('T')[0];
                                        if (lesson.replacement)
                                            repl = lesson.replacement;
                                    }

                                    return (
                                        <Fragment key={index}>
                                            <TableCell
                                                className={styles.lessonCell}
                                            >
                                                {lesson_date
                                                    ? `${
                                                          lesson_date.split(
                                                              '-'
                                                          )[2]
                                                      }.${
                                                          lesson_date.split(
                                                              '-'
                                                          )[1]
                                                      }.${
                                                          lesson_date.split(
                                                              '-'
                                                          )[0]
                                                      }`
                                                    : ''}
                                            </TableCell>
                                            <TableCell>
                                                {lesson && (
                                                    <DateCellOld
                                                        initialValue={
                                                            repl
                                                                ? moment(
                                                                      repl.date
                                                                  )
                                                                : undefined
                                                        }
                                                        column={
                                                            repl ? repl.id : 0
                                                        }
                                                        group={lesson.id}
                                                        row={item.student.id}
                                                        updateDates={
                                                            updateDates
                                                        }
                                                        month={
                                                            Number(month) - 1
                                                        }
                                                        short
                                                        year={moment().year()}
                                                        unlimited
                                                    />
                                                )}
                                            </TableCell>
                                        </Fragment>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </PageWrapper>
    );
};

import { memo, useCallback } from 'react';
import { QUARTER_END, QUARTERS_RU_OLD } from '../../constants/quarters';
import { findMark } from './JournalPageHelpers';
import moment, { Moment } from 'moment';
import { SelectCell } from '~/components/cells/SelectCell';
import { Months } from '../../constants/date';
import { UpdateData, UpdateQuarterData } from './Journal';
import {
    HOURS_OPTIONS,
    MARKS_OPTIONS
} from '../../constants/selectCellOptions';
import { Table } from '~/components/table';
import { NameHeader } from '~/components/table/nameHeader';
import { TableHeader } from '~/components/table/tableHeader';
import { compareByClass } from '~/utils/comparators';
import { NameCell } from '~/components/cells/NameCell';
import { ClassCell } from '~/components/cells/ClassCell';
import styles from './journal.module.css';

const QUARTER_END_MONTHS = [9, 11, 2, 4];

type Props = {
    parsedDates: Moment[];
    month: Months;
    updateQuarterData: UpdateQuarterData;
    updateMyData: UpdateData;
    studentData: TeacherCourseStudent[];
    onlyHours: boolean;
};

export const IndividualJournalView = memo(
    ({
        parsedDates,
        month,
        updateQuarterData,
        updateMyData,
        studentData,
        onlyHours
    }: Props) => {
        const getQuarterMark = useCallback(
            (quaterMarks: QuarterMark[], student: Student) => {
                if (!QUARTER_END[month]) return;

                const mark = quaterMarks.find(
                    (mark) => mark.period === QUARTER_END[month]
                );
                const year = quaterMarks.find((mark) => mark.period === 'year');

                return (
                    <>
                        <SelectCell
                            value={mark?.mark}
                            options={MARKS_OPTIONS}
                            onSelect={(value) =>
                                updateQuarterData({
                                    row: student.id,
                                    column: mark
                                        ? mark.period
                                        : QUARTER_END[month],
                                    value: value as string
                                })
                            }
                        />
                        {month === Months.MAY && (
                            <SelectCell
                                value={year?.mark}
                                options={MARKS_OPTIONS}
                                onSelect={(value) =>
                                    updateQuarterData({
                                        row: student.id,
                                        column: year?.period || 'year',
                                        value: value as string
                                    })
                                }
                            />
                        )}
                    </>
                );
            },
            [month]
        );

        return (
            <>
                <Table>
                    <thead>
                        <tr>
                            <NameHeader rowSpan={2} />
                            <TableHeader rowSpan={2}>Класс</TableHeader>
                            {parsedDates.map((date) => (
                                <TableHeader key={date.format()}>
                                    {date.format('DD.MM')}
                                </TableHeader>
                            ))}
                            {!onlyHours &&
                                QUARTER_END_MONTHS.includes(month) && (
                                    <TableHeader
                                        className={styles.quarterHeader}
                                        rowSpan={2}
                                    >
                                        {
                                            QUARTERS_RU_OLD[
                                                QUARTER_END_MONTHS.indexOf(
                                                    month
                                                )
                                            ]
                                        }
                                    </TableHeader>
                                )}
                            {!onlyHours && month === 4 && (
                                <TableHeader
                                    className={styles.quarterHeader}
                                    rowSpan={2}
                                >
                                    Год
                                </TableHeader>
                            )}
                        </tr>
                        <tr>
                            {parsedDates.map((date) => (
                                <TableHeader key={date.format()}>
                                    {moment.weekdaysMin(date.isoWeekday())}
                                </TableHeader>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {studentData
                            .sort(compareByClass)
                            .map(
                                ({
                                    student,
                                    archived,
                                    journalEntry,
                                    quaterMark
                                }) => (
                                    <tr key={student.id}>
                                        <NameCell
                                            name={student.name}
                                            surname={student.surname}
                                            archived={archived}
                                        />
                                        <ClassCell
                                            classNum={student.class}
                                            program={student.program}
                                            archived={archived}
                                        />
                                        {parsedDates.map((date, index) => (
                                            <SelectCell
                                                key={date.format()}
                                                value={findMark(
                                                    date,
                                                    journalEntry
                                                )}
                                                onSelect={(value) =>
                                                    updateMyData({
                                                        row: student.id,
                                                        column: index,
                                                        value: value as string
                                                    })
                                                }
                                                isWeekend={
                                                    date.isoWeekday() === 6
                                                }
                                                disabled={archived}
                                                options={
                                                    onlyHours
                                                        ? HOURS_OPTIONS
                                                        : MARKS_OPTIONS
                                                }
                                            />
                                        ))}
                                        {!onlyHours &&
                                            getQuarterMark(quaterMark, student)}
                                    </tr>
                                )
                            )}
                    </tbody>
                </Table>
            </>
        );
    }
);

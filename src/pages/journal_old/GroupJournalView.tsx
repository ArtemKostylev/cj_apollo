import { memo, useMemo } from 'react';
import { findMark } from './JournalPageHelpers';
import { DateCell } from '~/components/cells/DateCell';
import { SelectCell } from '~/components/cells/SelectCell';
import { compareStudents } from '../../utils/comparators';
import {
    MONTHS_IN_PERIODS,
    QUARTERS_IN_PERIODS
} from '../../utils/academicDate';
import { Months, MONTHS_RU, Periods } from '../../constants/date';
import {
    DateByGroup,
    Pair,
    UpdateData,
    UpdateDates,
    UpdateQuarterData
} from './Journal';
import {
    HOURS_OPTIONS,
    MARKS_OPTIONS
} from '../../constants/selectCellOptions';
import { GroupHeader } from '~/components/table/GroupHeader';
import { NameHeader } from '~/components/table/nameHeader';
import { TableHeader } from '~/components/table/tableHeader';
import { PeriodQuarters } from './PeriodQuarters';
import { NameCell_old } from '~/components/cells/NameCell_old';
import { Table } from '~/components/table';
import moment from 'moment';

type Props = {
    datesByGroup: DateByGroup[][];
    groupedData: Pair[];
    period: Periods;
    updateDates: UpdateDates;
    updateMyData: UpdateData;
    updateQuarterData: UpdateQuarterData;
    onlyHours: boolean;
    year: number;
};

export const GroupJournalView = memo(
    ({
        datesByGroup,
        groupedData,
        period,
        updateDates,
        updateMyData,
        updateQuarterData,
        onlyHours
    }: Props) => {
        const selectCellOptions = useMemo(
            () => (onlyHours ? HOURS_OPTIONS : MARKS_OPTIONS),
            [onlyHours]
        );
        return (
            <div>
                {datesByGroup.map((group, gIndex) => {
                    const groupItem = groupedData[gIndex];

                    return (
                        <Table key={gIndex}>
                            <thead>
                                <GroupHeader
                                    period={period}
                                    classNumber={groupItem.class}
                                    program={groupItem.program}
                                    subgroup={groupItem.subgroup}
                                />
                                <tr>
                                    <NameHeader rowSpan={2} />
                                    {MONTHS_IN_PERIODS[period].map((month) => (
                                        <TableHeader
                                            key={month}
                                            colSpan={
                                                month === Months.JANUARY ? 4 : 5
                                            }
                                        >
                                            {
                                                MONTHS_RU.find(
                                                    (m) => m.value === month
                                                )?.text
                                            }
                                        </TableHeader>
                                    ))}
                                    <PeriodQuarters
                                        period={period}
                                        onlyHours={onlyHours}
                                    />
                                </tr>
                                <tr>
                                    {group.map((date, id) => (
                                        <TableHeader hoverEnabled>
                                            <DateCell
                                                initialValue={date.date}
                                                column={id}
                                                month={date.month}
                                                group={gIndex}
                                                updateDates={updateDates}
                                                key={id}
                                                year={moment().year()}
                                                short
                                            />
                                        </TableHeader>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {groupItem.students
                                    .sort(compareStudents)
                                    .map(
                                        ({
                                            student,
                                            journalEntry,
                                            archived,
                                            quaterMark
                                        }) => (
                                            <tr>
                                                <NameCell_old
                                                    name={student.name}
                                                    surname={student.surname}
                                                    archived={archived}
                                                />
                                                {group.map((date, index) => (
                                                    <SelectCell
                                                        disabled={archived}
                                                        value={findMark(
                                                            date.date,
                                                            journalEntry
                                                        )}
                                                        key={index}
                                                        options={
                                                            selectCellOptions
                                                        }
                                                        onSelect={(value) =>
                                                            updateMyData({
                                                                row: student.id,
                                                                column: index,
                                                                group: gIndex,
                                                                value: value as string
                                                            })
                                                        }
                                                    />
                                                ))}
                                                {!onlyHours &&
                                                    QUARTERS_IN_PERIODS[
                                                        period
                                                    ].map((quarter) => {
                                                        const mark =
                                                            quaterMark.find(
                                                                (mark) =>
                                                                    mark.period ===
                                                                    quarter
                                                            );

                                                        return (
                                                            <SelectCell
                                                                value={
                                                                    mark?.mark
                                                                }
                                                                key={quarter}
                                                                options={
                                                                    MARKS_OPTIONS
                                                                }
                                                                onSelect={(
                                                                    value
                                                                ) =>
                                                                    updateQuarterData(
                                                                        {
                                                                            row: student.id
                                                                                ? student.id
                                                                                : 0,
                                                                            column: quarter,
                                                                            value: value as string
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                        );
                                                    })}
                                            </tr>
                                        )
                                    )}
                            </tbody>
                        </Table>
                    );
                })}
            </div>
        );
    }
);

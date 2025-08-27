import { Table } from '~/components/table';
import type { GroupJournalTable as GroupJournalTableType } from '~/models/groupJournal';
import { GroupJournalHeader } from './GroupJournalHeader';
import { Periods, type AcademicYears } from '~/constants/date';
import { SelectCell } from '~/components/cells/SelectCell';
import type { ChangedMark } from '~/models/mark';
import { useCallback, useMemo, useRef } from 'react';
import {
    getMarkColumnId,
    getQuarterMarkColumnId,
    parseGroupHeaderColumnId,
    parseMarkColumnId,
    parseQuarterMarkColumnId
} from './utils';
import { HOURS_OPTIONS, MARKS_OPTIONS } from '~/constants/selectCellOptions';
import { getQuartersInPeriod } from '~/utils/academicDate';
import type { ChangedQuarterMark } from '~/models/quarterMark';

interface Props {
    table: GroupJournalTableType;
    period: Periods;
    onlyHours: boolean;
    tableIndex: string;
    year: AcademicYears;
    onMarkChange: (columnId: string, mark: ChangedMark) => void;
    onMarkDateChange: (columnId: string, mark: ChangedMark) => void;
    onQuarterMarkChange: (
        columnId: string,
        quarterMark: ChangedQuarterMark
    ) => void;
}

export const GroupJournalTable = (props: Props) => {
    const {
        table,
        period,
        onlyHours,
        tableIndex,
        year,
        onMarkChange: onMarkChangeProp,
        onMarkDateChange,
        onQuarterMarkChange: onQuarterMarkChangeProp
    } = props;

    const dates = useRef<Record<string, string[]>>(table.dates);
    const quarters = useMemo(() => getQuartersInPeriod(period), [period]);

    const onDateChange = useCallback(
        (columnId: string, value: string) => {
            const { month, index } = parseGroupHeaderColumnId(columnId);
            dates.current[month][index] = value;

            const originalDate = table.dates[month][index];

            Object.values(table.rows).forEach((row) => {
                const markToChange = row.marks[originalDate];
                if (markToChange) {
                    const markColumnId = getMarkColumnId(
                        tableIndex,
                        month,
                        row.relationId,
                        index
                    );
                    onMarkDateChange(markColumnId, {
                        id: markToChange.id as number,
                        date: value,
                        mark: markToChange.mark,
                        relationId: row.relationId
                    });
                }
            });
        },
        [table.rows, onMarkChangeProp]
    );

    const onMarkChange = useCallback(
        (columnId: string, value: string) => {
            const { month, index, relationId } = parseMarkColumnId(columnId);
            const originalDate = table.dates[month][index];
            const actualDate = dates.current[month][index];

            const row = table.rows[relationId];
            const markToChange = table.rows[relationId].marks[originalDate];

            onMarkChangeProp(columnId, {
                id: markToChange.id as number,
                date: actualDate,
                relationId: row.relationId,
                mark: value
            });
        },
        [onMarkChangeProp]
    );

    const onQuarterMarkChange = useCallback(
        (columnId: string, value: string) => {
            const { quarter, relationId } = parseQuarterMarkColumnId(columnId);

            const row = table.rows[relationId];
            const quarterMarkToChange = row.quarterMarks[quarter];

            onQuarterMarkChangeProp(columnId, {
                mark: value,
                id: quarterMarkToChange.id as number,
                period: quarterMarkToChange.period,
                year: quarterMarkToChange.year,
                relationId: row.relationId
            });
        },
        [onQuarterMarkChangeProp]
    );

    const selectOptions = useMemo(
        () => (onlyHours ? HOURS_OPTIONS : MARKS_OPTIONS),
        [onlyHours]
    );

    return (
        <div>
            <div>{table.group}</div>
            <Table>
                <GroupJournalHeader
                    initialDates={dates.current}
                    onDateChange={onDateChange}
                    disabled={false}
                    period={period}
                    onlyHours={onlyHours}
                    year={year}
                    tableIndex={tableIndex}
                />
                <tbody>
                    {Object.values(table.rows).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.entries(table.dates).map(([month, dates]) =>
                                dates.map((date, dateIndex) => (
                                    <SelectCell
                                        options={selectOptions}
                                        key={`${rowIndex}-${date}`}
                                        value={row.marks[date]?.mark}
                                        onSelect={(value: string) =>
                                            onMarkChange(
                                                getMarkColumnId(
                                                    tableIndex,
                                                    month,
                                                    dateIndex,
                                                    row.relationId
                                                ),
                                                value
                                            )
                                        }
                                        disabled={row.archived}
                                    />
                                ))
                            )}
                            {!onlyHours &&
                                quarters.map((quarter) => (
                                    <SelectCell
                                        value={row.quarterMarks[quarter].mark}
                                        options={selectOptions}
                                        onSelect={(value: string) =>
                                            onQuarterMarkChange(
                                                getQuarterMarkColumnId(
                                                    tableIndex,
                                                    quarter,
                                                    row.relationId
                                                ),
                                                value
                                            )
                                        }
                                        disabled={row.archived}
                                    />
                                ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

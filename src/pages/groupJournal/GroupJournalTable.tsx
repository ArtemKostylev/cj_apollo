import { Table } from '~/components/table';
import type { GroupJournalTable as GroupJournalTableType } from '~/models/groupJournal';
import { GroupJournalHeader } from './GroupJournalHeader';
import { Periods, type AcademicYears } from '~/constants/date';
import { SelectCell } from '~/components/cells/selectCell';
import type { ChangedMark } from '~/models/mark';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    getMarkColumnId,
    getQuarterMarkColumnId,
    parseGroupHeaderColumnId,
    parseMarkColumnId,
    parseQuarterMarkColumnId,
    sortMonths
} from './utils';
import { HOURS_OPTIONS, MARKS_OPTIONS } from '~/constants/selectCellOptions';
import { getCurrentAcademicYear, getQuartersInPeriod } from '~/utils/academicDate';
import type { ChangedQuarterMark } from '~/models/quarterMark';
import styles from './groupJournal.module.css';
import { NameCell } from '~/components/cells/NameCell';
import { MarkCell } from './MarkCell';
import { GroupName } from './GroupName';

interface Props {
    table: GroupJournalTableType;
    period: Periods;
    onlyHours: boolean;
    tableIndex: string;
    year: AcademicYears;
    onMarkChange: (columnId: string, mark: ChangedMark) => void;
    onMarkDateChange: (columnId: string, mark: ChangedMark) => void;
    onQuarterMarkChange: (columnId: string, quarterMark: ChangedQuarterMark) => void;
}

export const GroupJournalTable = memo((props: Props) => {
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
    const dates = useRef<Record<string, string[]>>(JSON.parse(JSON.stringify(table.dates)));
    const [actualDates, setActualDates] = useState(dates.current);
    const quarters = useMemo(() => getQuartersInPeriod(period), [period]);

    const datesDisabled = useMemo(() => {
        return year !== getCurrentAcademicYear();
    }, [year]);

    const onDateChange = useCallback(
        (columnId: string, value: string) => {
            const { month, index } = parseGroupHeaderColumnId(columnId);
            dates.current[month][index] = value;
            setActualDates({ ...dates.current });

            const originalDate = table.dates[month][index];

            Object.values(table.rows).forEach((row) => {
                const markToChange = row.marks[originalDate];
                if (markToChange) {
                    const markColumnId = getMarkColumnId({
                        tableIndex,
                        month,
                        index,
                        relationId: row.relationId
                    });
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

            if (!originalDate && !actualDate) {
                throw new Error('Original date and actual date are not set');
                // TODO: show notification
            }

            const row = table.rows[relationId];

            if (!row) {
                throw new Error('Row not found');
            }

            const markToChange = table.rows[relationId].marks[originalDate];

            onMarkChangeProp(columnId, {
                id: (markToChange?.id as number) || 0,
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
                id: (quarterMarkToChange?.id as number) || 0,
                period: quarter,
                year,
                relationId: row.relationId
            });
        },
        [onQuarterMarkChangeProp, year]
    );

    const selectOptions = useMemo(() => (onlyHours ? HOURS_OPTIONS : MARKS_OPTIONS), [onlyHours]);

    useEffect(() => {
        setActualDates({ ...table.dates });
        dates.current = { ...table.dates };
    }, [table.dates]);

    return (
        <div className={styles.groupJournalTable}>
            <GroupName group={table.group} />
            <Table>
                <GroupJournalHeader
                    initialDates={dates.current}
                    onDateChange={onDateChange}
                    disabled={datesDisabled}
                    period={period}
                    onlyHours={onlyHours}
                    year={year}
                    changedDates={actualDates}
                />
                <tbody>
                    {Object.values(table.rows).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <NameCell name={row.studentName} archived={row.archived} />
                            {Object.entries(table.dates)
                                .sort(sortMonths)
                                .map(([month, dates]) =>
                                    dates.map((date, dateIndex) => (
                                        <MarkCell
                                            selectOptions={selectOptions}
                                            key={`${rowIndex}-${date}-${dateIndex}`}
                                            mark={row.marks[date]?.mark}
                                            onMarkChange={onMarkChange}
                                            archived={row.archived}
                                            rowIndex={rowIndex}
                                            date={date}
                                            dateIndex={dateIndex}
                                            relationId={row.relationId}
                                            tableIndex={tableIndex}
                                            month={month}
                                        />
                                    ))
                                )}
                            {!onlyHours &&
                                quarters.map((quarter) => (
                                    <SelectCell
                                        key={quarter}
                                        value={row.quarterMarks[quarter]?.mark}
                                        options={selectOptions}
                                        onSelect={(value: string) =>
                                            onQuarterMarkChange(
                                                getQuarterMarkColumnId({
                                                    tableIndex,
                                                    quarter,
                                                    relationId: row.relationId
                                                }),
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
});

import { TableHeader } from '~/components/table/tableHeader';
import { NameHeader } from '~/components/table/nameHeader';
import { MONTHS_IN_PERIODS, Months, Periods, MONTHS_NAMES, type AcademicYears } from '~/constants/date';
import { QuarterHeaders } from './QuarterHeaders';
import { getGroupHeaderColumnId, sortMonths } from './utils';
import { memo, useMemo } from 'react';
import { DateCell } from '~/components/cells/dateCell';

interface Props {
    initialDates: Record<string, string[]>;
    onDateChange: (columnId: string, value: string) => void;
    disabled: boolean;
    onlyHours: boolean;
    period: Periods;
    year: AcademicYears;
    changedDates: Record<string, string[]>;
}

export const GroupJournalHeader = memo((props: Props) => {
    const { initialDates, period, onlyHours, year, disabled, onDateChange, changedDates } = props;

    const monthWidth = useMemo(() => {
        return period === Periods.FIRST ? '55px' : '45px';
    }, [period]);

    return (
        <thead>
            <tr>
                <NameHeader rowSpan={2} />
                {MONTHS_IN_PERIODS[period].map((month) => (
                    <TableHeader key={month + MONTHS_NAMES[month]} colSpan={month === Months.JANUARY ? 4 : 5}>
                        {MONTHS_NAMES[month]}
                    </TableHeader>
                ))}
                <QuarterHeaders period={period} onlyHours={onlyHours} />
            </tr>
            <tr>
                {Object.entries(initialDates)
                    .sort(sortMonths)
                    .map(([month, dates]) =>
                        dates.map((date, index) => (
                            <TableHeader key={month + index} hoverEnabled width={monthWidth}>
                                <DateCell
                                    changedDates={changedDates}
                                    initialValue={date}
                                    columnId={getGroupHeaderColumnId({
                                        month,
                                        index
                                    })}
                                    month={month as Months}
                                    year={year}
                                    disabled={disabled}
                                    onChange={onDateChange}
                                />
                            </TableHeader>
                        ))
                    )}
            </tr>
        </thead>
    );
});

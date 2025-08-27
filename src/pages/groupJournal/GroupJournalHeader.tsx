import { TableHeader } from '~/components/table/tableHeader';
import { NameHeader } from '~/components/table/nameHeader';
import {
    MONTHS_IN_PERIODS,
    Months,
    Periods,
    MONTHS_NAMES,
    type AcademicYears
} from '~/constants/date';
import { QuarterHeaders } from './QuarterHeaders';
import { DateHeader } from './dateHeader';
import { getGroupHeaderColumnId } from './utils';

interface Props {
    initialDates: Record<string, string[]>;
    onDateChange: (columnId: string, value: string) => void;
    tableIndex: string;
    disabled: boolean;
    onlyHours: boolean;
    period: Periods;
    year: AcademicYears;
}

export const GroupJournalHeader = (props: Props) => {
    const {
        initialDates,
        period,
        onlyHours,
        year,
        disabled,
        onDateChange,
        tableIndex
    } = props;

    return (
        <thead>
            <tr>
                <NameHeader rowSpan={2} />
                {MONTHS_IN_PERIODS[period].map((month) => (
                    <TableHeader
                        key={month}
                        colSpan={month === Months.JANUARY ? 4 : 5}
                    >
                        {MONTHS_NAMES[month]}
                    </TableHeader>
                ))}
                <QuarterHeaders period={period} onlyHours={onlyHours} />
            </tr>
            <tr>
                {Object.entries(initialDates).map(([month, dates]) =>
                    dates.map((date, index) => (
                        <TableHeader key={month + index} hoverEnabled>
                            <DateHeader
                                initialValue={date}
                                columnId={getGroupHeaderColumnId(month, index)}
                                month={month}
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
};

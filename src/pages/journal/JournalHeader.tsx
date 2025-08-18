import { TableHeader } from '~/components/table/tableHeader';
import type { Moment } from 'moment';
import { QUARTERS_RU, type Quarters } from '~/constants/date';
import moment from 'moment';

interface Props {
    dates: Moment[];
    quarters: Quarters[];
}

export const JournalHeader = (props: Props) => {
    const { dates, quarters } = props;

    return (
        <thead>
            <tr>
                <TableHeader rowSpan={2} width="240px">
                    Имя ученика
                </TableHeader>
                <TableHeader rowSpan={2}>Класс</TableHeader>
                {dates.map((date) => (
                    <TableHeader key={date.format()}>
                        {date.format('DD.MM')}
                    </TableHeader>
                ))}
                {quarters.map((quarter) => (
                    <TableHeader key={quarter} rowSpan={2}>
                        {QUARTERS_RU[quarter]}
                    </TableHeader>
                ))}
            </tr>
            <tr>
                {dates.map((date) => (
                    <TableHeader key={date.format()}>
                        {moment.weekdaysMin(date.isoWeekday())}
                    </TableHeader>
                ))}
            </tr>
        </thead>
    );
};

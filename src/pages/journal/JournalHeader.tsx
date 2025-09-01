import { format } from 'date-fns';
import { TableHeader } from '~/components/table/tableHeader';
import { DATE_FORMAT_WEEKDAY, DATE_FORMAT_SHORT, QUARTERS_RU, type Quarters } from '~/constants/date';
import { ru } from 'date-fns/locale';

interface Props {
    dates: Date[];
    quarters: Quarters[];
}

export const JournalHeader = (props: Props) => {
    const { dates, quarters } = props;
    debugger;

    return (
        <thead>
            <tr>
                <TableHeader rowSpan={2} width="240px">
                    Имя ученика
                </TableHeader>
                <TableHeader rowSpan={2}>Класс</TableHeader>
                {dates.map((date) => (
                    <TableHeader key={date.toISOString()}>{format(date, DATE_FORMAT_SHORT)}</TableHeader>
                ))}
                {quarters.map((quarter) => (
                    <TableHeader key={quarter} rowSpan={2}>
                        {QUARTERS_RU[quarter]}
                    </TableHeader>
                ))}
            </tr>
            <tr>
                {dates.map((date) => (
                    <TableHeader key={date.toISOString()}>
                        {format(date, DATE_FORMAT_WEEKDAY, { locale: ru })}
                    </TableHeader>
                ))}
            </tr>
        </thead>
    );
};

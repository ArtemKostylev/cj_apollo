import { endOfMonth, format, parse } from 'date-fns';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { DATE_FORMAT, type AcademicYears, type Months } from '~/constants/date';
import { academicYearToCalendarByMonth } from '~/utils/academicDate';
import ru from 'date-fns/locale/ru';
import { DateHeaderInput } from './DateHeaderInput';

interface Props {
    initialValue: string;
    onChange: (columnId: string, value: string) => void;
    columnId: string;
    month: string;
    year: AcademicYears;
    disabled?: boolean;
    changedDates: Record<string, string[]>;
}

export const DateHeader = memo((props: Props) => {
    const { initialValue, onChange: onChangeProp, columnId, month, year, disabled, changedDates } = props;

    const [pickerValue, setPickerValue] = useState<Date | undefined>(undefined);

    useEffect(() => {
        initialValue && setPickerValue(parse(initialValue, DATE_FORMAT, new Date()));
    }, [initialValue]);

    const onChange = useCallback(
        (date: Date | null) => {
            if (!date) return;
            onChangeProp(columnId, format(date, DATE_FORMAT));
            setPickerValue(date);
        },
        [onChangeProp, columnId]
    );

    const { minDate, maxDate } = useMemo(() => {
        if (disabled) {
            return { minDate: undefined, maxDate: undefined };
        }

        const calendarYear = academicYearToCalendarByMonth(year, ('' + Number(month)) as Months);
        const startDate = new Date(calendarYear, Number(month), 1);
        const endDate = endOfMonth(startDate);

        return {
            minDate: startDate,
            maxDate: endDate
        };
    }, [disabled, month, year]);

    const shouldRerenderDates = JSON.stringify(changedDates[month]);
    const excludeDates = useMemo(() => {
        return changedDates[month].map((date) => parse(date, DATE_FORMAT, new Date()));
    }, [changedDates, month, shouldRerenderDates]);

    return (
        <DatePicker
            excludeDates={excludeDates}
            selected={pickerValue}
            onChange={onChange}
            customInput={<DateHeaderInput />}
            popperPlacement="bottom"
            locale={ru}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
        />
    );
});

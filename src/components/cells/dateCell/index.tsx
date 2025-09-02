import { endOfMonth, format, parse } from 'date-fns';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { DATE_FORMAT, type AcademicYears, type Months } from '~/constants/date';
import { academicYearToCalendarByMonth } from '~/utils/academicDate';
import ru from 'date-fns/locale/ru';
import { DateCellCustomInput } from '~/components/cells/dateCell/DateCellCustomInput';

interface Props {
    initialValue: string | undefined;
    onChange: (columnId: string, value: string) => void;
    columnId: string;
    month?: string;
    year: AcademicYears;
    disabled?: boolean;
    changedDates?: Record<string, string[]>;
}

export const DateCell = memo((props: Props) => {
    const { initialValue, onChange: onChangeProp, columnId, month, year, disabled, changedDates } = props;

    const [pickerValue, setPickerValue] = useState<Date | undefined>(undefined);

    const openToDate = useMemo(() => {
        if (pickerValue) return pickerValue;

        const calendarYear = academicYearToCalendarByMonth(year, ('' + Number(month)) as Months);
        if (month !== undefined) return new Date(calendarYear, Number(month), 1);
        const date = new Date();
        date.setFullYear(calendarYear);
        return date;
    }, [pickerValue, month, year]);

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
        if (disabled || !month) {
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

    const shouldRerenderDates = !!changedDates && month !== undefined && JSON.stringify(changedDates[month]);
    const excludeDates = useMemo(() => {
        if (!changedDates || month === undefined) return [];
        return changedDates[month].map((date) => parse(date, DATE_FORMAT, new Date()));
    }, [changedDates, month, shouldRerenderDates]);

    return (
        <DatePicker
            excludeDates={excludeDates}
            openToDate={openToDate}
            selected={pickerValue}
            onChange={onChange}
            customInput={<DateCellCustomInput />}
            popperPlacement="bottom"
            locale={ru}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
        />
    );
});

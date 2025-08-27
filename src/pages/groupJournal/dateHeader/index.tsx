import { endOfMonth, format } from 'date-fns';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { BACKEND_DATE_FORMAT, type AcademicYears } from '~/constants/date';
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
}

export const DateHeader = memo((props: Props) => {
    const {
        initialValue,
        onChange: onChangeProp,
        columnId,
        month,
        year,
        disabled
    } = props;

    const [pickerValue, setPickerValue] = useState<Date | undefined>(undefined);

    useEffect(() => {
        initialValue && setPickerValue(new Date(initialValue));
    }, [initialValue]);

    const onChange = useCallback(
        (date: Date | null) => {
            if (!date) return;
            onChangeProp(columnId, format(date, BACKEND_DATE_FORMAT));
        },
        [onChangeProp, columnId]
    );

    const { minDate, maxDate } = useMemo(() => {
        if (disabled) {
            return { minDate: undefined, maxDate: undefined };
        }

        const calendarYear = academicYearToCalendarByMonth(year, Number(month));
        const startDate = new Date(calendarYear, Number(month), 1);
        const endDate = endOfMonth(startDate);

        return {
            minDate: startDate,
            maxDate: endDate
        };
    }, [disabled, month, year]);

    return (
        <DatePicker
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

import { useState, useEffect, useMemo, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
import moment, { Moment } from 'moment';
import {
    getBorderDatesForMonth,
    getBorderDatesForPeriod
} from '../../../utils/academicDate';
import { convertDate, LimitException } from './utils';
import { Container } from './Container';
import { Input } from './Input';
import { Periods } from '../../../constants/date';
import { UpdateDatesProps } from '../../../types/updateDatesProps';

interface EditableDateCellProps {
    initialValue: Moment | undefined;
    updateDates: (
        props: Omit<UpdateDatesProps, 'hours'> & { group: number }
    ) => void;
    column?: number;
    group?: number;
    month: number;
    row?: number;
    unlimited?: boolean;
    short?: boolean;
    disabled?: boolean;
    year?: number;
    period?: Periods;
}

//? Should column group, month and row be defaulted to 0?
export const DateCell = ({
    initialValue,
    updateDates,
    column = 0,
    group = 0,
    month = 0,
    row = 0,
    unlimited,
    short,
    disabled,
    year,
    period
}: EditableDateCellProps) => {
    // TODO: move component state to higher level and get rid of effect
    const [value, setValue] = useState(initialValue?.toDate());

    const openToDate = useMemo(() => {
        if (unlimited) {
            return moment().toDate();
        }
    }, [unlimited]);

    const { dateGte, dateLte } = useMemo(() => {
        if (!disabled && !unlimited) {
            if (period) {
                return getBorderDatesForPeriod(period, moment().year());
            }
            if (year) {
                return getBorderDatesForMonth(month, year);
            }
            throw new LimitException();
        }

        return { dateGte: null, dateLte: null };
    }, [disabled, unlimited, month, year]);

    const onChange = useCallback(
        (date: Date | null) => {
            updateDates({ date: moment(date), column, group, row });
            setValue(date || undefined);
        },
        [column, group, row, updateDates]
    );

    useEffect(() => {
        setValue(initialValue?.toDate());
    }, [initialValue]);

    if (disabled) {
        return <span>{convertDate(value?.toLocaleDateString(), !short)}</span>;
    }

    return (
        <DatePicker
            selected={value}
            onChange={onChange}
            customInput={<Input short={short} />}
            popperPlacement={'bottom'}
            minDate={dateGte?.toDate()}
            maxDate={dateLte?.toDate()}
            openToDate={openToDate}
            locale={ru}
            calendarContainer={Container}
        />
    );
};

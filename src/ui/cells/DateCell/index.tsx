import { useState, useEffect, useMemo, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
import moment, { Moment } from 'moment';
import { UpdateDatesProps } from '../../../Pages/UserPages/ConsultsPage/ConsultController';
import { getBorderDatesForMonth } from '../../../utils/academicDate';
import { EmptyYearException, convertDate } from './utils';
import { Container } from './Container';
import { Input } from './Input';

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
}: EditableDateCellProps) => {
  // TODO: move component state to higher level and get rid of effect
  const [value, setValue] = useState(initialValue?.toDate());

  const openToDate = useMemo(() => {
    if (unlimited) {
      if (!year) throw new EmptyYearException();
      return moment().year(year).toDate();
    }
  }, [unlimited, year]);

  const { dateGte, dateLte } = useMemo(() => {
    if (!disabled && !unlimited) {
      if (!year) throw new EmptyYearException();
      return getBorderDatesForMonth(month, year);
    }

    return { dateGte: null, dateLte: null };
  }, [disabled, unlimited, month, year]);

  const onChange = useCallback(
    (date: Date) => {
      updateDates({ date: moment(date), column, group, row });
      setValue(date);
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
      popperPlacement='auto'
      minDate={dateGte?.toDate()}
      maxDate={dateLte?.toDate()}
      openToDate={openToDate}
      locale={ru}
      calendarContainer={Container}
    />
  );
};

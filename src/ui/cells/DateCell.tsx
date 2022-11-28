import React, {forwardRef, useState, useEffect, ForwardedRef, MouseEventHandler, ReactNode} from 'react';
import styled from 'styled-components';
import DatePicker, {CalendarContainer} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
import moment, {Moment} from 'moment';
import {UpdateDatesProps} from '../../Pages/UserPages/ConsultsPage/ConsultController';
import {getYearByMonth} from '../../utils/academicDate';

const DATE_PLACEHOLDER = '.....';

const ContainerWrapper = styled.div`
  line-height: 1em;
`

type ContainerProps = {
  className: string;
  children: ReactNode
}

const Container = ({className, children}: ContainerProps) => (
  <ContainerWrapper>
    <CalendarContainer className={className}>
      {children}
    </CalendarContainer>
  </ContainerWrapper>
);

const convertDate = (value: string | undefined, full: boolean) => {
  if (!value) return DATE_PLACEHOLDER;

  const [month, day, year] = value.split('/');

  const date = `${day}.${month}`;

  if (full) return date.concat(`.${year}`);

  return date;
};

const InputWrapper = styled.div`
  width: 100%;
  text-align: center;
  cursor: pointer;
  padding-left: 4px;
  padding-right: 4px;
  margin: 0;
`;

type InputProps = {
  value?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  full: boolean;
}

const Input = forwardRef(({value, onClick, full}: InputProps, ref: ForwardedRef<any>) => (
  <InputWrapper onClick={onClick} ref={ref}>
    {convertDate(value, full)}
  </InputWrapper>
));

type EditableDateCellProps = {
  initialValue: Moment | undefined;
  updateDates: (props: Omit<UpdateDatesProps, 'hours'> & { group: number }) => void;
  column?: number;
  group?: number;
  month: number;
  row?: number;
  unlimited?: boolean;
  full?: boolean;
  disabled?: boolean;
  year: number;
}

export const DateCell = ({
                           initialValue,
                           updateDates,
                           column,
                           group,
                           month,
                           row = 0,
                           unlimited,
                           full = true,
                           disabled,
                           year
                         }: EditableDateCellProps) => {
  const [value, setValue] = useState(initialValue?.toDate());

  useEffect(() => {
    setValue(initialValue?.toDate());
  }, [initialValue]);

  if (disabled) {
    return <span>{convertDate(value?.toLocaleDateString(), full)}</span>;
  }

  const startDate = unlimited ? null : moment().clone().year(getYearByMonth(month, year)).month(month).startOf('month').toDate();
  const endDate = unlimited ? null : moment().clone().year(getYearByMonth(month, year)).month(month).endOf('month').toDate();

  return (
    <DatePicker
      selected={value}
      onChange={(date: Date) => {
        updateDates({date: moment(date), column: column || 0, group: group || 0, row: row || 0});
        setValue(date);
      }}
      customInput={<Input full={full}/>}
      popperPlacement='auto'
      minDate={startDate}
      maxDate={endDate}
      openToDate={unlimited ? moment().year(year).toDate() : undefined}
      locale={ru}
      calendarContainer={Container}
    />
  );
};

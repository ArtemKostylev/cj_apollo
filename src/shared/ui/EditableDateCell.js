import React, {forwardRef, useState, useEffect, useRef} from 'react';
import styled, {css} from 'styled-components';
import DatePicker, {CalendarContainer} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/Journal.css';
import ru from 'date-fns/locale/ru';
import {getYear} from '../../utils/date';
import moment from 'moment';

const DATE_PLACEHOLDER = '.....';

const ContainerWrapper = styled.div`
  line-height: 1em;
`

const Container = ({className, children}) => (
    <ContainerWrapper>
        <CalendarContainer className={className}>
            {children}
        </CalendarContainer>
    </ContainerWrapper>
);

const convertDate = ({value, full}) => {
    if (!value) return DATE_PLACEHOLDER;

    const [month, day, year] = value.split('/');

    const date = `${day}.${month}`;

    if (full) date.concat(`.${year}`);

    return date;
};

const InputWrapper = styled.p`
  width: 100%;
  text-align: center;
  padding: 0;
  cursor: pointer;
  margin: 0;
`;

const Input = forwardRef(({value, onClick, full}, ref) => (
    <InputWrapper onClick={onClick} ref={ref}>
        {convertDate({value, full})}
    </InputWrapper>
));

const EditableDateCell = ({
                              initialValue,
                              updateDates,
                              column,
                              group,
                              month,
                              row,
                              unlimited = false,
                              full = true,
                              disabled = false,
                              year
                          }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    if (disabled) {
        return convertDate({value, full});
    }

    // TODO: replace input month with month - 1
    const startDate = unlimited
        ? ''
        : moment()
            .clone()
            .year(getYear(month, year))
            .month(month)
            .startOf('month')
            .toDate();

    const endDate = unlimited
        ? ''
        : moment()
            .clone()
            .year(getYear(month, year))
            .month(month)
            .endOf('month')
            .toDate();

    return (
        <DatePicker
            selected={value}
            onChange={(date) => {
                updateDates({
                    date: date,
                    column: column,
                    group: group,
                    row: row || 0,
                });
                setValue(date);
            }}
            customInput={<Input/>}
            popperPlacement='auto'
            minDate={startDate}
            maxDate={endDate}
            full={full}
            openToDate={unlimited ? moment().year(year).toDate() : undefined}
            locale={ru}
            calendarContainer={Container}
        />
    );
};

export default EditableDateCell;

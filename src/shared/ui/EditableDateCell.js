import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Journal.css';
import ru from 'date-fns/locale/ru';
import { getYear } from '../../scripts/utils';
import moment from 'moment';

const DATE_PLACEHOLDER = '.....';

const convertDate = ({ value, full }) => {
  if (!value) return DATE_PLACEHOLDER;

  const [month, day, year] = value.split('/');

  const date = `${day}.${month}`;

  if (full) date.concat(`.${year}`);

  return date;
};

const InputWrapper = styled.p`
  padding: 0;
  cursor: pointer;
  margin: 0;
`;

const Input = forwardRef(({ value, onClick, full }, ref) => (
  <InputWrapper onClick={onClick} ref={ref}>
    {convertDate({ value, full })}
  </InputWrapper>
));

const EditableDateCell = ({
  initialValue,
  updateDates,
  column,
  group,
  month,
  row,
  full = true,
  disabled = false,
}) => {
  const [value, setValue] = useState(initialValue);

  if (disabled) {
    return convertDate({ value, full });
  }

  // TODO: replace input month with month - 1
  const start_date = moment()
    .clone()
    .year(getYear(month))
    .month(month)
    .startOf('month')
    .toDate();

  const end_date = moment()
    .clone()
    .year(getYear(month))
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
      customInput={<Input />}
      minDate={start_date}
      maxDate={end_date}
      full={full}
      locale={ru}
    />
  );
};

export default EditableDateCell;
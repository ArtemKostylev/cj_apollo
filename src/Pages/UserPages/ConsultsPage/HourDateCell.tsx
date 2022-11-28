import React, {useState, useEffect, useCallback, ChangeEvent} from 'react';
import {DateCell} from '../../../ui/cells/DateCell';
import {HOURS} from '../../../constants/hours';
import moment, {Moment} from 'moment';
import {UpdateDatesProps} from './ConsultController';

type Props = {
  column: number;
  hours: number;
  date: Moment;
  row: number;
  updateDates: (props: UpdateDatesProps) => void;
  year: number;
}

const HourDateCell = ({column, hours, date, row, updateDates, year}: Props) => {
  const [hoursValue, setHoursValue] = useState(hours);

  useEffect(() => {
    setHoursValue(hours);
  }, [hours, setHoursValue]);

  const onChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseFloat(event.target.value)
    setHoursValue(value);
    updateDates({date, hours: value, column, row});
  }, [date, column, row]);

  return (
    <React.Fragment>
      <td>
        <DateCell month={moment().month()} initialValue={date} column={column || 0} row={row || 0} updateDates={updateDates} unlimited
                  year={year}/>
      </td>
      <td>
        <select value={hoursValue} onChange={onChange}>
          {HOURS.map(it => <option value={it} key={it}>{it}</option>)}
        </select>
      </td>
    </React.Fragment>
  );
};

export default HourDateCell;
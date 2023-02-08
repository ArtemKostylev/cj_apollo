import React from 'react';
import {PROGRAMS} from '../../../constants/programs';
import HourDateCell from './HourDateCell';
import {TableControlsConfig} from '../../../ui/TableControls/types';
import '../../../styles/Consult.css';
import {UpdateDatesProps} from './ConsultController';
import moment from 'moment';
import {TableCell} from '../../../ui/cells/styles/TableCell.styled';

type Props = {
  data: any;
  controlsConfig: TableControlsConfig;
  updateDates: (props: UpdateDatesProps) => void;
  long?: boolean;
  year: number;
}


const GroupConsultsView = ({data, controlsConfig, updateDates, long = false, year}: Props) => (
  <div className='consult_container'>
    <table className='consult_table'>
      <thead>
      <tr>
        <th className='name_column'>Группа</th>
        <th className='date_columns' colSpan={long ? 32 : 16}>
          Даты/Часы
        </th>
      </tr>
      </thead>
      <tbody>
      {data.map((item: any) => (
        <tr key={item.group}>
          <TableCell>
            {`${item.group.split(' ')[0]} ${PROGRAMS[item.group.split(' ')[1]]} ${item.group.split(' ')[2]}`}
          </TableCell>
          {Array(long ? 16 : 8).fill(1).map((num, index) => (
            <HourDateCell
              updateDates={updateDates}
              column={item.consult[index]?.id || `ui_${index}`}
              row={item.group}
              date={item.consult[index] && moment(item.consult[index].date)}
              hours={item.consult[index]?.hours}
            />
          ))}
        </tr>
      ))}
      </tbody>
    </table>
  </div>
);
export default GroupConsultsView;

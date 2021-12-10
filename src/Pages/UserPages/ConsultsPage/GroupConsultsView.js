import React from 'react';
import { PROGRAMS } from '../../../constants/programs';
import HourDateCell from './HourDateCell';
import Controls from '../../../components/Controls';
import '../../../styles/Consult.css';

const GroupConsultsView = ({
  data,
  controlItems,
  updateDates,
  long = false,
}) => (
  <div className='consult_container'>
    <Controls items={controlItems} />
    <table className='consult_table'>
      <thead>
        <tr>
          <th className='name_column'>Группа</th>
          <th className='date_columns' colSpan={long ? '32' : '16'}>
            Даты/Часы
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, sindex) => (
          <tr key={item.group}>
            <td className='name_cell'>
              {`${item.group.split(' ')[0]} ${
                PROGRAMS[item.group.split(' ')[1]]
              } ${item.group.split(' ')[2]}`}
            </td>
            {Array(long ? 16 : 8)
              .fill(1)
              .map((num, index) => (
                <HourDateCell
                  updateDates={updateDates}
                  column={item.consults[index]?.id || 0}
                  row={item.group}
                  date={
                    item.consults[index]
                      ? new Date(item.consults[index].date.split('T')[0])
                      : ''
                  }
                  hours={item.consults[index]?.hours}
                />
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default GroupConsultsView;

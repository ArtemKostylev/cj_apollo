import React from 'react';
import '../../../styles/Journal.css';
import EditableDateCell from '../../../components/EditableDateCell';
import { PROGRAMS } from '../../../constants/programs';
import { EditableCellHours } from './EditableCellHours';

const GroupCompanyView = ({
  data,
  groupedData,
  period,
  updateDates,
  updateMyData,
  updateQuaterData,
}) => {
  return (
    <>
      <table className='journal_table'>
        <tbody>
          {data
            .sort((a, b) => {
              if (a.class < b.class) return -1;
              if (a.class > b.class) return 1;
              return 0;
            })
            .map((group, g_index) => {
              return (
                <React.Fragment key={g_index}>
                  <tr>
                    <th className='name_column' rowSpan='2'>
                      Группа
                    </th>
                    {period.data.map((month) => (
                      <th key={month.id} colSpan={month.id === 1 ? '4' : '5'}>
                        {month.name}
                      </th>
                    ))}
                  </tr>

                  <tr>
                    {group.hours.map((date, id) => {
                      return (
                        <th className='date'>
                          <EditableDateCell
                            initialValue={
                              date.date === ''
                                ? ''
                                : new Date(date.date.split('T')[0])
                            }
                            column={id}
                            month={date.month}
                            group={g_index}
                            updateDates={updateDates}
                            full={false}
                            key={id}
                          />
                        </th>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className='name_cell'>{`${group.group.split(' ')[0]} ${
                      PROGRAMS[group.group.split(' ')[1]]
                    } ${group.group.split(' ')[2]}`}</td>
                    {group.hours.map((date, index) => (
                      <EditableCellHours
                        value={date.hours}
                        row={g_index}
                        column={index}
                        updateMyData={updateMyData}
                        weekend={''}
                        key={index}
                      />
                    ))}
                  </tr>
                </React.Fragment>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default GroupCompanyView;

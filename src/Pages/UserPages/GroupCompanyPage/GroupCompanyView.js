import React from 'react';
import EditableDateCell from '../../../shared/ui/EditableDateCell';
import { PROGRAMS } from '../../../constants/programs';
import { EditableCell } from '../../../shared/ui/EditableCell';
import { Table } from '../../../shared/ui/tableUi/Table';
import { NameColumnHeader } from '../../../shared/ui/tableUi/NameColumnHeader';
import { TableHeader } from '../../../shared/ui/TableHeader';
import { HOURS_OPTIONS } from '../../../constants/marksOptions';
import { NameCell } from '../../../shared/ui/tableUi/NameCell';

const GroupCompanyView = ({ data, period, updateDates, updateMyData }) => {
  return (
    <Table>
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
                <NameColumnHeader text='Группа' />
                {period.data.map((month) => (
                  <TableHeader
                    key={month.id}
                    colSpan={month.id === 1 ? '4' : '5'}
                    text={month.name}
                  />
                ))}
              </tr>
              <tr>
                {group.hours.map((date, index) => (
                  <EditableDateCell
                    initialValue={
                      date.date ? '' : new Date(date.date.split('T')[0])
                    }
                    column={index}
                    month={date.month - 1}
                    group={g_index}
                    updateDates={updateDates}
                    full={false}
                    key={index}
                  />
                ))}
              </tr>
              <tr>
                <NameCell>
                  {`${group.group.split(' ')[0]} ${
                    PROGRAMS[group.group.split(' ')[1]]
                  } ${group.group.split(' ')[2]}`}
                </NameCell>
                {group.hours.map((date, index) => (
                  <EditableCell
                    value={date.hours}
                    row={g_index}
                    column={index}
                    updateMyData={updateMyData}
                    key={index}
                    options={HOURS_OPTIONS}
                  />
                ))}
              </tr>
            </React.Fragment>
          );
        })}
    </Table>
  );
};

export default GroupCompanyView;

import React from 'react';
import HourDateCell from './HourDateCell';
import {TableControls, TableControlsConfig} from '../../../shared/ui/TableControls';
import '../../../styles/Consult.css';
import {UpdateDatesProps} from './ConsultController';
import times from 'lodash/times';
import {NameCell} from '../../../shared/ui/table/NameCell';

type Props = {
  controlsConfig: TableControlsConfig;
  data: any;
  updateDates: (props: UpdateDatesProps) => void;
  year: string;
}

const IndividualConsultsView = ({controlsConfig, data, updateDates, year}: Props) => {
  return (
    <div className='consult_container'>
      <TableControls config={controlsConfig}/>
      <table className='consult_table'>
        <thead>
        <tr>
          <th className='name_column'>Имя ученика</th>
          <th className='date_columns' colSpan={32}>
            Даты/Часы
          </th>
        </tr>
        </thead>
        <tbody>
        {data.map((item: any) => (
          <tr key={item.student.surname}>
            <NameCell name={item.student.name} surname={item.student.surname}/>
            {times(16, (index) => (
              <HourDateCell
                updateDates={updateDates}
                column={item.consult[index]?.id || `ui_${index}`}
                row={item.student.id}
                date={item.consult[index] && new Date(item.consult[index].date.split('T')[0])}
                hours={item.consult[index]?.hours}
                key={index}
                year={year}
              />
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};
export default IndividualConsultsView;

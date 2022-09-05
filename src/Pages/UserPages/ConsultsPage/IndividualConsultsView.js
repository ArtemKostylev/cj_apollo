import React from 'react';
import HourDateCell from './HourDateCell';
import Controls from '../../../shared/ui/Controls';
import '../../../styles/Consult.css';

const IndividualConsultsView = ({controlItems, data, updateDates, year}) => {
    return (
        <div className='consult_container'>
            <Controls items={controlItems}/>
            <table className='consult_table'>
                <thead>
                <tr>
                    <th className='name_column'>Имя ученика</th>
                    <th className='date_columns' colSpan='32'>
                        Даты/Часы
                    </th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.student.surname}>
                        <td className='name_cell'>
                            {`${item.student.surname} ${item.student.name}`}
                        </td>
                        {Array(16)
                            .fill(1)
                            .map((num, index) => (
                                <HourDateCell
                                    updateDates={updateDates}
                                    column={item.consult[index]?.id || `ui_${index}`}
                                    row={item.student.id}
                                    date={
                                        item.consult[index]
                                            ? new Date(item.consult[index].date.split('T')[0])
                                            : ''
                                    }
                                    hours={item.consult[index]?.hours}
                                    key={index}
                                    year={year}
                                    unlimited
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

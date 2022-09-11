import React from 'react';
import {findMark} from './JournalPageHelpers';
import '../../../styles/Journal.css';
import EditableDateCell from '../../../shared/ui/EditableDateCell';
import {EditableCell} from '../../../shared/ui/EditableCell';
import {PROGRAMS} from '../../../constants/programs';
import {compareStudents} from '../../../utils/comparators';
import {MARKS_OPTIONS, HOURS_OPTIONS} from '../../../constants/marksOptions';

const GroupJournalView = ({
                              dates_by_group,
                              groupedData,
                              period,
                              updateDates,
                              updateMyData,
                              updateQuarterData,
                              onlyHours,
                              year
                          }) => {
    const prepareQuarters = () =>
        period.id === 0 ? ['first', 'second'] : ['third', 'fourth', 'year'];

    return (
        <>
            <table className='journal_table'>
                <tbody>
                {dates_by_group.map((group, g_index) => {
                    return (
                        <React.Fragment key={g_index}>
                            <tr className='group_row'>
                                <th colSpan={period.id === 0 ? '23' : '27'}>
                                    <div>
                                        <p>{`Класс:  ${groupedData[g_index].class}${
                                            PROGRAMS[`${groupedData[g_index].program}`]
                                        }`}</p>
                                        <p>{`Группа: ${
                                            groupedData[g_index].subgroup || 'не указана'
                                        }`}</p>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <th className='name_column' rowSpan='2'>
                                    Имя ученика
                                </th>
                                {period.data.map((month) => (
                                    <th key={month.id} colSpan={month.id === 1 ? '4' : '5'}>
                                        {month.name}
                                    </th>
                                ))}
                                {!onlyHours && (
                                    <>
                                        <th rowSpan='2' className='quarter_column'>
                                            {period.id === 0 ? 'I четверть' : 'III четверть'}
                                        </th>
                                        <th rowSpan='2' className='quarter_column'>
                                            {period.id === 0 ? 'II четверть' : 'IV четверть'}
                                        </th>
                                        {period.id === 1 && (
                                            <th rowSpan='2' className='quarter_column'>
                                                Годовая оценка
                                            </th>
                                        )}
                                    </>
                                )}
                            </tr>

                            <tr>
                                {group.map((date, id) => {
                                    return (
                                        <th className='date'>
                                            <EditableDateCell
                                                initialValue={
                                                    date.date === ''
                                                        ? ''
                                                        : new Date(date.date.split('T')[0])
                                                }
                                                column={id}
                                                month={date.month - 1}
                                                group={g_index}
                                                updateDates={updateDates}
                                                full={false}
                                                key={id}
                                                year={year}
                                            />
                                        </th>
                                    );
                                })}
                            </tr>
                            {groupedData[g_index].students
                                .sort(compareStudents)
                                .map((item) => (
                                    <tr>
                                        <td
                                            className='name_cell'
                                            style={{color: item.archived ? 'gray' : 'black'}}
                                        >{`${item.student.surname} ${item.student.name} ${
                                            item.archived ? '(A)' : ''
                                        }`}</td>
                                        {group.map((date, index) => (
                                            <EditableCell
                                                disabled={item.archived}
                                                value={findMark(date.date, item.journalEntry)}
                                                onClick={(value) =>
                                                    updateMyData({
                                                        row: item.student.id,
                                                        column: index,
                                                        group: g_index,
                                                        value,
                                                    })
                                                }
                                                key={index}
                                                options={onlyHours ? HOURS_OPTIONS : MARKS_OPTIONS}
                                            />
                                        ))}
                                        {!onlyHours &&
                                            prepareQuarters().map((quat) => {
                                                var mark = '';
                                                try {
                                                    mark = item.quaterMark.find(
                                                        (mark) => mark.period === quat
                                                    );
                                                } catch {
                                                    mark = '';
                                                }

                                                return (
                                                    <EditableCell
                                                        value={mark ? mark.mark : ''}
                                                        onClick={(value) =>
                                                            updateQuarterData({
                                                                row: item.student.id ? item.student.id : '',
                                                                column: quat,
                                                                group: g_index,
                                                                value,
                                                            })
                                                        }
                                                        key={quat}
                                                        options={MARKS_OPTIONS}
                                                    />
                                                );
                                            })}
                                    </tr>
                                ))}
                        </React.Fragment>
                    );
                })}
                </tbody>
            </table>
        </>
    );
};

export default GroupJournalView;

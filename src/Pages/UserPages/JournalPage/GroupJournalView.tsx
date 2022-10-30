import React from 'react';
import {findMark} from './JournalPageHelpers';
import '../../../styles/Journal.css';
import {EditableDateCell} from '../../../shared/ui/EditableDateCell';
import {EditableCell} from '../../../shared/ui/EditableCell';
import {PROGRAMS} from '../../../constants/programs';
import {compareStudents} from '../../../utils/comparators';
import {HOURS_OPTIONS, MARKS_OPTIONS} from '../../../constants/editableCellOptions';
import {MONTHS_IN_PERIODS, QUARTERS_IN_PERIODS} from '../../../utils/academicDate';
import {Months, MONTHS_RU, Periods} from '../../../@types/date';
import {DateByGroup, Pair, UpdateData, UpdateDates, UpdateQuarterData} from './Journal';

type Props = {
  dates_by_group: DateByGroup[][];
  groupedData: Pair[];
  period: Periods;
  updateDates: UpdateDates;
  updateMyData: UpdateData;
  updateQuarterData: UpdateQuarterData;
  onlyHours: boolean;
  year: number;
}

const GroupJournalView = ({dates_by_group, groupedData, period, updateDates, updateMyData, updateQuarterData, onlyHours, year}: Props) => {
  return (
    <>
      <table className='journal_table'>
        <tbody>
        {dates_by_group.map((group, g_index) => {
          return (
            <React.Fragment key={g_index}>
              <tr className='group_row'>
                <th colSpan={period === Periods.FIRST ? 23 : 27}>
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
                <th className='name_column' rowSpan={2}>Имя ученика</th>
                {MONTHS_IN_PERIODS[period].map((month) => (
                  <th key={month} colSpan={month === Months.JANUARY ? 4 : 5}>
                    {MONTHS_RU.get(month)?.text}
                  </th>
                ))}
                {!onlyHours && (
                  <>
                    <th rowSpan={2} className='quarter_column'>
                      {period === Periods.FIRST ? 'I четверть' : 'III четверть'}
                    </th>
                    <th rowSpan={2} className='quarter_column'>
                      {period === Periods.SECOND ? 'II четверть' : 'IV четверть'}
                    </th>
                    {period === Periods.SECOND && (
                      <th rowSpan={2} className='quarter_column'>
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
                        initialValue={date.date}
                        column={id}
                        month={date.month}
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
                            value: (value as string),
                          })
                        }
                        key={index}
                        options={onlyHours ? HOURS_OPTIONS : MARKS_OPTIONS}
                      />
                    ))}
                    {!onlyHours &&
                      QUARTERS_IN_PERIODS[period].map((quarter) => {
                        let mark;
                        try {
                          mark = item.quaterMark.find(
                            (mark) => mark.period === quarter
                          );
                        } catch {
                          mark = undefined;
                        }

                        return (
                          <EditableCell
                            value={mark?.mark}
                            onClick={(value) =>
                              updateQuarterData({
                                row: item.student.id ? item.student.id : 0,
                                column: quarter,
                                value: (value as string),
                              })
                            }
                            key={quarter}
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

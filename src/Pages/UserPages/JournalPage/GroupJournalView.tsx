import React, {memo, useMemo} from 'react';
import {findMark} from './JournalPageHelpers';
import {DateCell} from '../../../ui/cells/DateCell';
import {SelectCell} from '../../../ui/cells/SelectCell';
import {compareStudents} from '../../../utils/comparators';
import {MONTHS_IN_PERIODS, QUARTERS_IN_PERIODS} from '../../../utils/academicDate';
import {Months, MONTHS_RU, Periods} from '../../../constants/date';
import {DateByGroup, Pair, UpdateData, UpdateDates, UpdateQuarterData} from './Journal';
import {HOURS_OPTIONS, MARKS_OPTIONS} from '../../../constants/selectCellOptions';
import {GroupHeader} from '../../../ui/Table/GroupHeader';
import {NameHeader} from '../../../ui/Table/NameHeader';
import {Header} from '../../../ui/Table/style/Header.styled';
import {PeriodQuarters} from './PeriodQuarters';
import {NameView} from '../../../ui/cells/NameView';
import {Table} from '../../../ui/Table';

type Props = {
  datesByGroup: DateByGroup[][];
  groupedData: Pair[];
  period: Periods;
  updateDates: UpdateDates;
  updateMyData: UpdateData;
  updateQuarterData: UpdateQuarterData;
  onlyHours: boolean;
  year: number;
}

export const GroupJournalView = memo(({datesByGroup, groupedData, period, updateDates, updateMyData, updateQuarterData, onlyHours, year}: Props) => {
  const selectCellOptions = useMemo(() => onlyHours ? HOURS_OPTIONS : MARKS_OPTIONS, [onlyHours]);
  return (<div>
    {datesByGroup.map((group, gIndex) => {
      const groupItem = groupedData[gIndex];

      return (
        <table key={gIndex}>
          <thead>
          <GroupHeader period={period} classNumber={groupItem.class} program={groupItem.program} subgroup={groupItem.subgroup}/>
          <tr>
            <NameHeader rowSpan={2}/>
            {MONTHS_IN_PERIODS[period].map((month) => (
              <Header key={month} colSpan={month === Months.JANUARY ? 4 : 5}>{MONTHS_RU.get(month)?.text}c</Header>))}
            <PeriodQuarters period={period} onlyHours={onlyHours}/>
          </tr>
          <tr>
            {group.map((date, id) => <Header hoverable>
              <DateCell initialValue={date.date} column={id} month={date.month} group={gIndex} updateDates={updateDates}
                        full={false} key={id} year={year}/>
            </Header>)}
          </tr>
          </thead>
          <tbody>
          {groupItem.students.sort(compareStudents).map(({student, journalEntry, archived, quaterMark}) => (
            <tr>
              <NameView name={student.name} surname={student.surname} archived={archived}/>
              {group.map((date, index) => (
                <SelectCell disabled={archived} value={findMark(date.date, journalEntry)} key={index} options={{selectOptions: selectCellOptions}}
                            onChange={(value) => updateMyData({row: student.id, column: index, group: gIndex, value: (value as string)})}
                            error={false}/>
              ))}
              {!onlyHours &&
                QUARTERS_IN_PERIODS[period].map((quarter) => {
                  const mark = quaterMark.find((mark) => mark.period === quarter);

                  return <SelectCell value={mark?.mark} key={quarter} options={{selectOptions: MARKS_OPTIONS}}
                                     onChange={(value) => updateQuarterData({
                                       row: student.id ? student.id : 0,
                                       column: quarter,
                                       value: (value as string)
                                     })} error={false}/>
                })}
            </tr>
          ))}
          </tbody>
        </table>
      );
    })}
  </div>)
});

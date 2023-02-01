import React, {memo, useCallback} from 'react';
import {QUARTER_END, QUARTERS_RU} from '../../../constants/quarters';
import {findMark} from './JournalPageHelpers';
import moment, {Moment} from 'moment';
import {SelectCell} from '../../../ui/cells/SelectCell';
import {Months} from '../../../constants/date';
import {UpdateData, UpdateQuarterData} from './Journal';
import {HOURS_OPTIONS, MARKS_OPTIONS} from '../../../constants/selectCellOptions';
import {Table} from '../../../ui/Table';
import {NameHeader} from '../../../ui/Table/NameHeader';
import {Header} from '../../../ui/Table/style/Header.styled';
import {QuarterHeader} from './style/QuarterHeader.styled';
import {compareByClass} from '../../../utils/comparators';
import {NameView} from '../../../ui/cells/NameView';
import {ClassView} from '../../../ui/cells/ClassView';

const QUARTER_END_MONTHS = [9, 11, 2, 4];

type Props = {
  parsedDates: Moment[];
  month: Months;
  updateQuarterData: UpdateQuarterData;
  updateMyData: UpdateData;
  studentData: TeacherCourseStudent[];
  onlyHours: boolean;
}

export const IndividualJournalView = memo(({parsedDates, month, updateQuarterData, updateMyData, studentData, onlyHours}: Props) => {
  const getQuarterMark = useCallback((quaterMarks: QuarterMark[], student: Student) => {
    if (!QUARTER_END[month]) return;

    const mark = quaterMarks.find((mark) => mark.period === QUARTER_END[month]);
    const year = month === Months.MAY && quaterMarks.find((mark) => mark.period === 'year');

    return (
      <>
        <SelectCell value={mark?.mark} options={{selectOptions: MARKS_OPTIONS}}
                    onChange={(value) => updateQuarterData({
                      row: student.id,
                      column: mark ? mark.period : QUARTER_END[month],
                      value: (value as string)
                    })}
        />
        {year && (<SelectCell value={year.mark} options={{selectOptions: MARKS_OPTIONS}}
                              onChange={(value) => updateQuarterData({
                                row: student.id,
                                column: year.period,
                                value: (value as string)
                              })}/>
        )}
      </>
    )
  }, [month]);

  return (
    <>
      <table>
        <thead>
        <tr>
          <NameHeader rowSpan={2}/>
          <Header rowSpan={2}>Класс</Header>
          {parsedDates.map((date) => (<Header key={date.format()}>{date.format('DD.MM')}</Header>))}
          {!onlyHours && QUARTER_END_MONTHS.includes(month) && (
            <QuarterHeader rowSpan={2}>{`${QUARTERS_RU[QUARTER_END_MONTHS.indexOf(month)]}`}</QuarterHeader>
          )}
          {!onlyHours && month === 4 && (<QuarterHeader rowSpan={2}>{`Год`}</QuarterHeader>)}
        </tr>
        <tr>
          {parsedDates.map((date) => (<Header key={date.format()}>{moment.weekdaysMin(date.isoWeekday())}</Header>))}
        </tr>
        </thead>
        <tbody>
        {studentData.sort(compareByClass).map(({student, archived, journalEntry, quaterMark}) => (
          <tr key={student.id}>
            <NameView name={student.name} surname={student.surname} archived={archived}/>
            <ClassView/>
            {parsedDates.map((date, index) => (
              <SelectCell
                key={date.format()}
                value={findMark(date, journalEntry)}
                onChange={(value) =>
                  updateMyData({
                    row: student.id,
                    column: index,
                    value: (value as string),
                  })
                }
                disabled={archived}
                options={{selectOptions: onlyHours ? HOURS_OPTIONS : MARKS_OPTIONS, isWeekend: date.isoWeekday() === 6}}
              />
            ))}
            {!onlyHours && getQuarterMark(quaterMark, student)}
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
});


import React, {memo, useMemo} from 'react';
import {QUARTERS_RU} from '../../../constants/quarters';
import {findMark} from './JournalPageHelpers';
import moment from 'moment';
import {SelectCell} from '../../../ui/cells/SelectCell';
import {Months} from '../../../constants/date';
import {HOURS_OPTIONS, MARKS_OPTIONS} from '../../../constants/selectCellOptions';
import {NameHeader} from '../../../ui/Table/NameHeader';
import {Header} from '../../../ui/Table/style/Header.styled';
import {QuarterHeader} from './style/QuarterHeader.styled';
import {compareByClass} from '../../../utils/comparators';
import {NameView} from '../../../ui/cells/NameView';
import {ClassView} from '../../../ui/cells/ClassView';
import {useQuery} from '@apollo/client';
import {FETCH_INDIVIDUAL_JOURNAL_QUERY} from '../../../graphql/queries/fetchJournal';
import {IndividualJournalEntry} from './types';
import {useAuth} from '../../../hooks/useAuth';
import {useLocation} from 'react-router-dom';
import {getBorderDatesForMonth} from '../../../utils/academicDate';
import {Spinner} from '../../../ui/Spinner';

const QUARTER_END_MONTHS = [9, 11, 2, 4];

type Props = {
  month: Months;
  year: number;
  course: number;
  onlyHours: boolean;
}

const useTeacherId = (year: number) => {
  const auth = useAuth();
  const location = useLocation() as any;

  return useMemo(() => {
    return location.state?.versions[year].id || auth.user?.versions[year].id
  }, [year])
}

export const IndividualJournal = memo(({month, year, course, onlyHours}: Props) => {

  const {dateGte, dateLte} = useMemo(() => getBorderDatesForMonth(month, year), [month, year]);


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


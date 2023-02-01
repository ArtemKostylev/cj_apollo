import {NetworkStatus, useMutation, useQuery} from '@apollo/client';
import moment, {Moment} from 'moment';
import React, {Fragment, useCallback, useMemo, useState} from 'react';
import {UPDATE_REPLACEMENTS_MUTATION} from '../../graphql/mutations/updateReplacement';
import {FETCH_REPLACEMENTS_QUERY} from '../../graphql/queries/fetchReplacements';
import {useAuth} from '../../hooks/useAuth';
import {DateCell} from '../../ui/cells/DateCell';
import {TableControlsConfig, TableControlType} from '../../ui/TableControls/types';
import '../../styles/Compensation.css';
import {useLocation} from "react-router-dom";
import times from 'lodash/times';
import styled from "styled-components";
import {updateInPosition} from '../../utils/crud';
import {MONTHS_RU, YEARS} from '../../constants/date';
import {getCurrentAcademicYear, SECOND_PERIOD_MONTHS} from '../../utils/academicDate';
import {TableCell} from '../../ui/cells/styles/TableCell.styled';
import {NameView} from '../../ui/cells/NameView';

type updateDatesProps = {
  date: Moment,
  column: number,
  group: number,
  row: number
}

const LessonCell = styled(TableCell)`
  background-color: #eff0f0;
  cursor: default;
  padding-left: 4px;
  padding-right: 4px;
`

export const Compensation = () => {
  let auth = useAuth();
  const location = useLocation() as any;
  let studentData: TeacherCourseStudent[] = [];

  const [course, setCourse] = useState(0);
  const [month, setMonth] = useState(moment().month());
  const [currentYear, setCurrentYear] = useState(getCurrentAcademicYear());

  const teacher = useMemo(() => location.state?.versions[currentYear].id || auth.user.versions[currentYear].id, [currentYear])
  const userCourses: Course[] = useMemo(() => location.state?.courses || auth.user?.versions[currentYear].courses, [location, auth])

  const year = SECOND_PERIOD_MONTHS.includes(month) ? currentYear + 1 : currentYear;

  const onYearChange = useCallback((year: number) => {
    setCurrentYear(year);
  }, []);

  const onCourseChange = useCallback((course: number) => {
    setCourse(course);
  }, []);

  const onMonthChange = useCallback((month: number) => {
    setMonth(month);
  }, []);

  const {loading, data, error, refetch, networkStatus} = useQuery(
    FETCH_REPLACEMENTS_QUERY,
    {
      variables: {
        teacherId: teacher,
        courseId: userCourses[course].id,
        date_gte: moment()
          .month(month)
          .year(year)
          .clone()
          .startOf('month')
          .utc()
          .format('YYYY-MM-DDTHH:mm:ss.SSS')
          .concat('Z'),
        date_lte: moment()
          .month(month)
          .year(year)
          .clone()
          .endOf('month')
          .utc()
          .format('YYYY-MM-DDTHH:mm:ss.SSS')
          .concat('Z'),
        year
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
    }
  );

  const [update] = useMutation(UPDATE_REPLACEMENTS_MUTATION);

  const save = async () => {
    const result: { id: number, date: string, entryId: number }[] = [];
    studentData.forEach((student) => {
      student.journalEntry.forEach((mark) => {
        if (mark.replacement)
          result.push({
            id: mark.replacement.id,
            date: mark.replacement.date,
            entryId: mark.id,
          });
      });
    });

    await update({
      variables: {
        data: result,
      },
    });

    refetch();
  };

  /*
  
    const controlsConfig: TableControlsConfig = useMemo(() => [
      {
        type: TableControlType.SELECT,
        options: MONTHS_RU,
        text: MONTHS_RU.get(month)?.text,
        onClick: onMonthChange,
      },
      {
        type: TableControlType.SELECT,
        options: new Map(userCourses.map((it, index) => [index, {value: index, text: it.name}])),
        text: userCourses[course].name,
        onClick: onCourseChange,
      },
      {
        type: TableControlType.SELECT,
        options: YEARS,
        text: YEARS.get(currentYear)?.text,
        onClick: onYearChange,
      },
      {
        type: TableControlType.BUTTON,
        text: "Сохранить",
        onClick: save,
      },
    ], [userCourses, currentYear, course, studentData]);
  */


  if (loading || networkStatus === NetworkStatus.refetch) return <div>Загрузка</div>;
  if (error) throw new Error('503');

  data.fetchReplacements.forEach((entry: TeacherCourseStudent) => {
    if (entry.journalEntry.length > 0) {
      studentData.push(entry);
    }
  });

  const updateDates = ({date, column, group, row}: updateDatesProps) => {
    const student = studentData.find((item) => item.student.id === row);
    if (!student) throw new Error(`Student with index ${row} was not found`)
    const studentIndex = studentData.indexOf(student);
    const mark = student.journalEntry.find((item) => item.id === group);
    const markIndex = mark ? student.journalEntry.indexOf(mark) : -1;

    const newRepl = {
      id: !mark?.replacement ? 0 : column,
      date: date,
      entryId: group,
    };

    studentData = updateInPosition(studentData, [{key: 'journalEntry', index: studentIndex}, {key: 'replacement', index: markIndex}], newRepl)
  };

  return (
    <>
      <table className='compensation_table'>
        <thead>
        <tr>
          <th className='name_column'>Имя ученика</th>
          {times(10, (index) => (
            <Fragment key={index}>
              <th>Пропуск</th>
              <th>Выдано</th>
            </Fragment>
          ))}
        </tr>
        </thead>
        <tbody>
        {studentData.map((item) => {
          return (
            <tr>
              <NameView surname={item.student.surname} name={item.student.name}/>
              {times(10, (index: number) => {
                let lesson = null;
                let lesson_date = null;
                let repl = null;
                if (item.journalEntry[index]) {
                  lesson = item.journalEntry[index];
                  lesson_date = lesson.date.split('T')[0];
                  if (lesson.replacement) repl = lesson.replacement;
                }

                return (
                  <Fragment key={index}>
                    <LessonCell>
                      {lesson_date ? `${lesson_date.split('-')[2]}.${lesson_date.split('-')[1]}.${lesson_date.split('-')[0]}` : ''}
                    </LessonCell>
                    <TableCell>
                      {lesson && <DateCell
                          initialValue={repl ? moment(repl.date) : undefined}
                          column={repl ? repl.id : 0}
                          group={lesson.id}
                          row={item.student.id}
                          updateDates={updateDates}
                          month={month - 1}
                          year={currentYear}
                          unlimited
                      />}
                    </TableCell>
                  </Fragment>)
              })}
            </tr>
          );
        })}
        </tbody>
      </table>
    </>
  );
}

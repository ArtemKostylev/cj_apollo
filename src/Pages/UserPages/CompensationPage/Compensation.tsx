import {NetworkStatus, useMutation, useQuery} from '@apollo/client';
import moment from 'moment';
import React, {useState, Fragment} from 'react';
import {UPDATE_REPLACEMENTS_MUTATION} from '../../../graphql/mutations/updateReplacement';
import {FETCH_REPLACEMENTS_QUERY} from '../../../graphql/queries/fetchReplacements';
import {useAuth} from '../../../hooks/useAuth';
import EditableDateCell from '../../../shared/ui/EditableDateCell';
import TableControls from '../../../shared/ui/TableControls';
import {getYear} from '../../../utils/date';
import '../../../styles/Compensation.css';
import {useLocation} from "react-router-dom";
import times from 'lodash/times';
import styled from "styled-components";

type updateDatesProps = {
  date: Date,
  column: number,
  group: number,
  row: number
}

const LessonCell = styled.td`
  background-color: #eff0f0;
  cursor: default;
  padding-left: 4px;
  padding-right: 4px;
`

export const Compensation = () => {
  let auth = useAuth();
  const location = useLocation() as any;

  const [course, setCourse] = useState(0);
  const [month, setMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(`${moment().year()}`);

  const year = getYear(month, selectedYear);

  const {loading, data, error, refetch, networkStatus} = useQuery(
    FETCH_REPLACEMENTS_QUERY,
    {
      variables: {
        teacherId: location.state?.versions[selectedYear].id || auth.user.versions[selectedYear].id,
        courseId:
          location.state?.versions[selectedYear].courses[course].id ||
          auth.user.versions[selectedYear].courses[course].id,
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

    refetch().then(() => console.log('RE-FETCHED'));
  };

  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;

  if (networkStatus === NetworkStatus.refetch) return spinner;

  if (error) throw new Error('503');

  let studentData: TeacherCourseStudent[] = [];

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

    const dateStr = date?.toLocaleDateString('ru-RU').split('.');
    const newRepl = {
      id: !mark?.replacement ? 0 : column,
      date: `${dateStr[2]}-${dateStr[1]}-${dateStr[0]}`.concat('T00:00:00.000Z'),
      entryId: group,
    };

    studentData = [
      ...studentData.slice(0, studentIndex),
      {
        ...studentData[studentIndex],
        journalEntry: [
          ...studentData[studentIndex].journalEntry.slice(0, markIndex),
          {
            ...studentData[studentIndex].journalEntry[markIndex],
            replacement: newRepl,
          },
          ...studentData[studentIndex].journalEntry.slice(markIndex + 1),
        ],
      },
      ...studentData.slice(studentIndex + 1),
    ];
  };

  return (
    <>
      <TableControls
        initialMonth={month}
        setMonth={setMonth}
        save={save}
        courses={location.state?.versions[selectedYear].courses || auth.user.versions[selectedYear].courses}
        course={course}
        setCourse={setCourse}
        setYear={setSelectedYear}
        year={selectedYear}
      />
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
              <td className='name_cell'>{`${item.student.surname} ${item.student.name}`}</td>
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
                    <td>
                      {lesson && <EditableDateCell
                          initialValue={repl ? new Date(repl.date.split('T')[0]) : ''}
                          column={repl ? repl.id : 0}
                          group={lesson.id}
                          row={item.student.id}
                          updateDates={updateDates}
                          month={month - 1}
                          year={selectedYear}
                          unlimited
                      />}
                    </td>
                  </Fragment>
                );
              })}
            </tr>
          );
        })}
        </tbody>
      </table>
    </>
  );
}

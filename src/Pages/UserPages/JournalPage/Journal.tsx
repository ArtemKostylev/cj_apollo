import React, {useMemo} from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import moment, {Moment} from 'moment';
import 'moment/locale/ru';
import {TableControlsConfig, TableControlType} from '../../../ui/TableControls/types';
import {IndividualJournal} from './IndividualJournalView';
import {GroupJournalView} from './GroupJournalView';
import {makeVar, NetworkStatus, useMutation, useQuery, useReactiveVar} from '@apollo/client';
import {FETCH_JOURNAL_QUERY} from '../../../graphql/queries/fetchJournal';
import {useAuth} from '../../../hooks/useAuth';
import {UPDATE_JOURNAL_MUTATION} from '../../../graphql/mutations/updateJournal';
import {t} from '../../../static/text';
import times from 'lodash/times';
import {DATE_FORMAT, Months, Periods} from '../../../constants/date';
import {getCurrentAcademicYear, getDatesFromMonth, MONTHS_IN_PERIODS} from '../../../utils/academicDate';
import {useLocation} from 'react-router-dom';
import {useTableControls} from '../../../ui/TableControls/useTableControls';
import {Spinner} from '../../../ui/Spinner';

export type Pair = {
  class: number,
  program: string,
  subgroup: number | undefined,
  students: TeacherCourseStudent[]
}

export type DateByGroup = { date: Moment | undefined, month: Months };
export type UpdateQuarterData = (args: { row: number, column: string, value: string }) => boolean;
export type UpdateData = (args: { row: number, column: number, value: string, group?: number }) => boolean;
export type UpdateDates = (args: { date: Moment, column: number, group: number }) => void;

export default function Journal() {
  const location = useLocation() as any;
  const auth = useAuth();
  const [update] = useMutation(UPDATE_JOURNAL_MUTATION);

  const yearVar = useMemo(() => makeVar(getCurrentAcademicYear()), []);
  const year = useReactiveVar(yearVar);

  const userCourses: Course[] = useMemo(() => location.state?.versions[year].courses || auth.user?.versions[year].courses, [location.state, auth.user, year]);

  const controlsConfig = useMemo(() => [
    /*userCourses[course].group ? {type: TableControlType.PERIOD} :*/
    {
      name: 'month',
      type: TableControlType.MONTH
    },
    {
      name: 'course',
      type: TableControlType.SELECT,
      initialValue: 0,
      options: new Map(userCourses.map((it, index) => [index, {value: index, text: it.name}])),
    },
    {
      name: 'year',
      type: TableControlType.YEAR,
      customVar: yearVar
    },
    {
      type: TableControlType.BUTTON,
      label: "Сохранить",
    }
  ], [year]);

  const [TableControls, {month, course}] = useTableControls(controlsConfig as TableControlsConfig);

  const parsedDates = useMemo(() => getDatesFromMonth(month, year), [month, year]);

  let {loading, data} = useQuery<{ fetchJournal: TeacherCourseStudent[] }>(FETCH_JOURNAL_QUERY, {
    variables: {
      teacherId: location.state?.versions[year].id || auth.user?.versions[year].id,
      courseId: userCourses[course].id,
      year: year
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (error) => {
      throw new Error(error.message);
    }
  });

  let studentData: TeacherCourseStudent[] = [];

  if (loading || !data) return <Spinner/>;  // TODO: this should lead to no content screen and allow further interaction with ui

  studentData = data.fetchJournal.map((student: TeacherCourseStudent) => ({
    ...student,
    journalEntry: [...student.journalEntry.map((entry) => ({...entry, delete_flag: false, update_flag: false}))],
    quaterMark: [...student.quaterMark.map((entry) => ({...entry, delete_flag: false, update_flag: false}))],
  }));

  if (studentData[0].student === null) {
    return <p>{t('no_data')}</p>;
  }
  let groupedData: Pair[] = [];

  if (userCourses[0].group) {
    let pairs: Pair[] = [];
    let classes: number[] = [];
    let programs: string[] = [];
    let subgroups: (number | undefined)[] = [];
    studentData.forEach((item) => {
      classes.push(item.student.class);
      programs.push(item.student.program);
      subgroups.push(item.subgroup);
    });

    classes = [...new Set(classes)];
    programs = [...new Set(programs)];
    subgroups = [...new Set(subgroups)];

    classes.forEach((num) => {
      programs.forEach((program) => {
        subgroups.forEach((subgroup) => {
          pairs.push({
            class: num,
            program: program,
            subgroup: subgroup,
            students: [],
          });
        });
      });
    });

    studentData.forEach((item) => {
      let pairIndex = pairs.findIndex(
        (pair) =>
          item.student.class === pair.class &&
          item.student.program === pair.program &&
          item.subgroup === (pair.subgroup)
      );
      pairs[pairIndex].students.push(item);
    });


    pairs.forEach((pair) => {
      if (pair.students.length > 0) groupedData.push(pair);
    });
    groupedData.sort((a, b) => {
      if (a.class < b.class) return -1;
      if (a.class > b.class) return 1;
      return 0;
    });
  }

  //inside groupedData we divide them by subgroups

  //iterate over all dates, grouped by class, program and subgroup
  // dates are stored in UTC strings (DD-MM-YYYYTHH:MM:SS.sssZ)

  let dates_by_group = groupedData.map((group) => {
    const dates = [...new Set(group.students.map((student) => student.journalEntry.map((item) => item.date)).flat())].map(it => moment(it));

    const mappedDates = new Map(MONTHS_IN_PERIODS['firstHalf'].map((it) => [it, [] as DateByGroup[]]));

    const result: DateByGroup[] = [];

    dates.forEach((date) => {
      if (date) {
        const month = date.month();

        const datesArray = mappedDates.get(month);

        if (datesArray) {
          mappedDates.set(month, [...datesArray, {date, month}]);
        }
      }
    });

    mappedDates.forEach((value, key) => {
      const maxDates = key === Months.JANUARY ? 4 : 5;
      const emptyCount = maxDates - value.length;
      result.push(...value, ...times(emptyCount, () => ({date: undefined, month: key})));
    });

    return result;
  });

  const updateDates: UpdateDates = ({date, column, group}) => {
    const oldDate = dates_by_group[group][column].date;

    let students = groupedData[group].students.map((item) => item.id);

    students = students.filter((student) =>
      studentData.find((item) => item.id === student)?.journalEntry.find((mark) => moment(mark.date).isSame(oldDate, 'days'))
    );

    students.forEach((studentIndex) => {
      const student = studentData.find((item) => item.id === studentIndex);
      if (!student) throw new Error(`Can't find student with id ${studentIndex}`)
      const marks = student.journalEntry;
      const cell = marks.find((el) => moment(el.date).isSame(oldDate, 'days'));

      if (!cell) throw new Error(`Can't fins cell with date ${oldDate}`)
      const studentId = studentData.indexOf(student);
      let index = marks.indexOf(cell);

      if (!cell.delete_flag) {
        studentData = [
          ...studentData.slice(0, studentId),
          {
            ...studentData[studentId],
            journalEntry: [
              ...studentData[studentId].journalEntry.slice(0, index),
              {
                ...studentData[studentId].journalEntry[index],
                date: date.format(DATE_FORMAT),
                update_flag: true,
              },
              ...studentData[studentId].journalEntry.slice(index + 1),
            ],
          },
          ...studentData.slice(studentId + 1),
        ];
      }
    });

    dates_by_group[group][column].date = date;
  };

  return (
    <>
      <TableControls/>
      {userCourses[0].group ? (
        <GroupJournalView
          datesByGroup={dates_by_group}
          groupedData={groupedData}
          period={Periods.FIRST}
          year={year}
          updateDates={updateDates}
          updateMyData={updateMyData}
          updateQuarterData={updateQuarterData}
          onlyHours={userCourses[year].onlyHours}
        />
      ) : (
        <IndividualJournal
          parsedDates={parsedDates}
          month={month}
          updateQuarterData={updateQuarterData}
          updateMyData={updateMyData}
          studentData={studentData}
          onlyHours={userCourses[0].onlyHours}
        />
      )}
    </>
  );
}

import React, {useCallback, useMemo, useState} from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import moment, {Moment} from 'moment';
import 'moment/locale/ru';
import {TableControls, TableControlType} from '../../../ui/TableControls';
import {IndividualJournalView} from './IndividualJournalView';
import {GroupJournalView} from './GroupJournalView';
import {useMutation, useQuery, NetworkStatus} from '@apollo/client';
import {FETCH_JOURNAL_QUERY} from '../../../graphql/queries/fetchJournal';
import {useAuth} from '../../../hooks/useAuth';
import {UPDATE_JOURNAL_MUTATION} from '../../../graphql/mutations/updateJournal';
import {t} from '../../../static/text';
import times from 'lodash/times';
import {DATE_FORMAT, Months, MONTHS_RU, Periods, PERIODS_RU, YEARS} from '../../../constants/date';
import {
  getCurrentAcademicMonth,
  getCurrentAcademicPeriod,
  getCurrentAcademicYear,
  getYearByMonth,
  MONTHS_IN_PERIODS
} from '../../../utils/academicDate';
import {useLocation} from 'react-router-dom';

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
  moment.locale('ru');
  const location = useLocation() as any;

  let auth = useAuth();

  const [month, setMonth] = React.useState<Months>(getCurrentAcademicMonth());
  const [course, setCourse] = useState(0);
  const [period, setPeriod] = useState<Periods>(getCurrentAcademicPeriod());
  const [currentYear, setCurrentYear] = useState(getCurrentAcademicYear());

  const userCourses: Course[] = useMemo(() => location.state?.versions[currentYear].courses || auth.user?.versions[currentYear].courses, [location.state, auth.user, currentYear]);

  const startDate = useMemo(() => moment().month(month).year(getYearByMonth(month, currentYear)), [month, currentYear]);

  const parsedDates = useMemo(() => createDates(startDate), [startDate]);

  const onYearChange = useCallback((year: number) => {
    setCurrentYear(year);
  }, []);

  const onCourseChange = useCallback((course: number) => {
    setCourse(course);
  }, []);

  const onMonthChange = useCallback((month: number) => {
    setMonth(month);
  }, []);

  const onPeriodChange = useCallback((period: Periods) => setPeriod(period), [])

  const updateMyData: UpdateData = ({row, column, value, group}) => {
    let date: Moment | undefined;
    if (group !== undefined && group > -1) {
      date = dates_by_group[group][column].date;
      if (!date) {
        alert(t('empty_date'));
        return false;
      }
    } else {
      date = parsedDates[column];
    }
    const student = studentData.find((item) => item.student.id === row);
    if (!student) throw new Error(`Can't find relation with id ${row}`)
    const marks = student.journalEntry;
    const cell = marks.find((el) => moment(el.date).isSame(date, 'days'));

    const studentId = studentData.indexOf(student);

    if (cell === undefined) {
      studentData = [
        ...studentData.slice(0, studentId),
        {
          ...studentData[studentId],
          journalEntry: [
            ...studentData[studentId].journalEntry,
            {
              id: 0,
              mark: value,
              date: date?.format(DATE_FORMAT),
              delete_flag: false,
              update_flag: true,
            },
          ],
        },
        ...studentData.slice(studentId + 1),
      ];
    } else {
      let index = marks.indexOf(cell);
      let flag = value === '';
      studentData = [
        ...studentData.slice(0, studentId),
        {
          ...studentData[studentId],
          journalEntry: [
            ...studentData[studentId].journalEntry.slice(0, index),
            {
              ...studentData[studentId].journalEntry[index],
              mark: value,
              delete_flag: flag,
              update_flag: !flag,
            },
            ...studentData[studentId].journalEntry.slice(index + 1),
          ],
        },
        ...studentData.slice(studentId + 1),
      ];
    }
    return true;
  };

  const updateQuarterData: UpdateQuarterData = ({row, column, value}) => {
    const student = studentData.find(item => item.student.id === row);
    if (!student) throw new Error(`Can't find relation with id ${row}`);
    const studentIndex = studentData.indexOf(student);

    let mark = student.quaterMark.find((item) => item.period === column);
    if (!mark) {
      const newMark = {
        id: 0,
        mark: value,
        period: column,
        year: currentYear,
        studentId: student.id,
        teacherId: location.state?.versions[currentYear].id || auth.user.versions[currentYear].id,
        courseId: userCourses[course].id,
        update_flag: true,
        delete_flag: false
      };
      studentData[studentIndex].quaterMark = [...studentData[studentIndex].quaterMark, newMark,];
      return true;
    }
    const markIndex = student.quaterMark.indexOf(mark);
    let flag = value === '';
    studentData = [
      ...studentData.slice(0, studentIndex),
      {
        ...studentData[studentIndex],
        quaterMark: [
          ...studentData[studentIndex].quaterMark.slice(0, markIndex),
          {
            ...studentData[studentIndex].quaterMark[markIndex],
            mark: value,
            delete_flag: flag,
            update_flag: !flag,
          },
          ...studentData[studentIndex].quaterMark.slice(markIndex + 1),
        ],
      },
      ...studentData.slice(studentIndex + 1),
    ];
    return true;
  };

  const createUpdateData = () => {
    let result = [];

    for (let i = 0; i < studentData.length; i++) {
      let student = studentData[i].journalEntry;
      for (let j = 0; j < student.length; j++) {
        let entry = student[j];
        if (entry.update_flag)
          result.push({
            id: entry.id,
            mark: entry.mark,
            date: entry.date,
            relationId: studentData[i].id,
          });
      }
    }

    return result;
  };

  const createClearData = () => {
    let result = [];
    for (let i = 0; i < studentData.length; i++) {
      let student = studentData[i].journalEntry;
      for (let j = 0; j < student.length; j++) {
        let entry = student[j];
        if (entry.delete_flag && entry.id !== 0) result.push(entry.id);
      }
    }
    return result;
  };

  const createQuaterData = () => {
    let result: QuarterMark[] = [];
    studentData.forEach((student) => {
      student.quaterMark.forEach((mark) => {
        if (mark.update_flag)
          result.push({
            id: mark.id,
            mark: mark.mark,
            period: mark.period,
            year: mark.year,
            relationId: student.id,
          });
      });
    });
    return result;
  };

  const createQuaterClearData = () => {
    let result: number[] = [];
    studentData.forEach((student) => {
      student.quaterMark.forEach((mark) => {
        if (mark.delete_flag && mark.id !== 0) result.push(mark.id);
      });
    });
    return result;
  };


  let {
    loading,
    data,
    error,
    refetch,
    networkStatus,
  } = useQuery<{ fetchJournal: TeacherCourseStudent[] }>(FETCH_JOURNAL_QUERY, {
    variables: {
      teacherId: location.state?.versions[currentYear].id || auth.user?.versions[currentYear].id,
      courseId: userCourses[course].id,
      year: moment().month() > 7 ? currentYear : currentYear - 1,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const [update] = useMutation(UPDATE_JOURNAL_MUTATION);

  const save = () => {
    update({
      variables: {
        data: {
          updateCasual: createUpdateData(),
          updatePeriod: createQuaterData(),
          deleteCasual: createClearData(),
          deletePeriod: createQuaterClearData(),
        },
      }
    }).then(() => refetch());
  };

  let studentData: TeacherCourseStudent[] = [];

  const controlsConfig = useMemo(() => [
    userCourses[course].group ? {
      type: TableControlType.SELECT,
      options: PERIODS_RU,
      text: PERIODS_RU.get(period)?.text,
      onClick: onPeriodChange
    } : {
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
  ], [userCourses, currentYear, course, month, period, studentData]);

  const spinner = <div>Загрузка</div>;

  if (error) throw new Error(error.message);
  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;
  if (!data) throw new Error('500');

  studentData = data.fetchJournal.map((student: TeacherCourseStudent) => ({
    ...student,
    journalEntry: [...student.journalEntry.map((entry) => ({...entry, delete_flag: false, update_flag: false}))],
    quaterMark: [...student.quaterMark.map((entry) => ({...entry, delete_flag: false, update_flag: false}))],
  }));

  if (studentData[0].student === null) {
    return <p>{t('no_data')}</p>;
  }
  let groupedData: Pair[] = [];

  if (userCourses[course].group) {
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

    const mappedDates = new Map(MONTHS_IN_PERIODS[period].map((it) => [it, [] as DateByGroup[]]));

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
      <TableControls config={controlsConfig}/>
      {userCourses[course].group ? (
        <GroupJournalView
          datesByGroup={dates_by_group}
          groupedData={groupedData}
          period={period}
          year={currentYear}
          updateDates={updateDates}
          updateMyData={updateMyData}
          updateQuarterData={updateQuarterData}
          onlyHours={userCourses[course].onlyHours}
        />
      ) : (
        <IndividualJournalView
          parsedDates={parsedDates}
          month={month}
          updateQuarterData={updateQuarterData}
          updateMyData={updateMyData}
          studentData={studentData}
          onlyHours={userCourses[course].onlyHours}
        />
      )}
    </>
  );
}

const createDates = (initialDate: Moment) => {
  let result = [];
  let start = initialDate.clone().startOf('month');
  let end = initialDate.clone().endOf('month');

  for (let date = start; date <= end; date.add(1, 'day')) {
    if (date.isoWeekday() !== 7) result.push(date.clone());
  }
  return result;
};

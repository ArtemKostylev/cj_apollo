import React, { useEffect, useState } from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import moment from 'moment';
import 'moment/locale/ru';
import TableControls from '../../../shared/ui/TableControls';
import IndividualJournalView from './IndividualJournalView';
import GroupJournalView from './GroupJournalView';
import { useMutation, useQuery, NetworkStatus } from '@apollo/client';
import { FETCH_JOURNAL_QUERY } from '../../../utils/queries';
import { useAuth } from '../../../utils/use-auth';
import { UPDATE_JOURNAL_MUTATION } from '../../../utils/mutations';
import { GROUP_PERIODS } from '../../../constants/periods';
import { getYear } from '../../../utils/utils';
import GroupCompanyView from '../GroupCompanyPage/GroupCompanyView';
import { getMonthFromUTCString } from './JournalPageHelpers';
import times from 'lodash/times';

export default function Journal(props) {
  moment.locale('ru');

  let auth = useAuth();

  const [month, setMonth] = React.useState(
    !![5, 6, 7].find((item) => item === moment().month()) ? 4 : moment().month()
  );
  const [course, setCourse] = useState(0);
  let changed = false;

  const [period, setPeriod] = useState(
    month > 7 ? GROUP_PERIODS['first_half'] : GROUP_PERIODS['second_half']
  );

  const userCourses = props.location.state?.courses || auth.user?.courses;
  const listener = (event) => {
    if (changed) {
      event.preventDefault();
      let confirm = window.confirm(
        'Вы действительно хотите покинуть страницу? Все несохраненные изменения будут потеряны.'
      );
      if (!confirm) event.stopImmediatePropagation();
    }
  };

  useEffect(() => {
    props.menuRef?.current.addEventListener('click', listener);

    return () => {
      props.menuRef?.current?.removeEventListener('click', listener);
    };
  });

  const startDate = moment().month(month).year(getYear(month));

  const parsedDates = createDates(startDate);

  const updateMyData = ({ row, column, value, group }) => {
    console.log(row, column, value, group);
    let date = '';
    if (group > -1) {
      date = dates_by_group[group][column].date;
      if (date === '') {
        alert('Пожалуйста, заполните дату');
        return false;
      }
    } else {
      date = parsedDates[column].format('YYYY-MM-DD');
    }
    const student = studentData.find((item) => item.student.id === row);
    const marks = student.journalEntry;
    const cell = marks.find(
      (el) => el.date.split('T')[0] === date || el.date === date
    );

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
              date: date.includes('T00:00:00.000Z')
                ? date
                : date.concat('T00:00:00.000Z'),
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
    changed = true;
    return true;
  };

  const updateQuarterData = ({ row, column, value, group }) => {
    const student = studentData.find((item, index) => item.student.id === row);
    const studentIndex = studentData.indexOf(student);
    var mark = student.quaterMark.find((item) => item.period === column);
    if (!mark) {
      const newMark = {
        id: 0,
        mark: value,
        period: column,
        studentId: student.id,
        teacherId: props.location.state?.teacher || auth.user.teacher,
        courseId: userCourses[course].id,
        update_flag: true,
      };
      studentData[studentIndex].quaterMark = [
        ...studentData[studentIndex].quaterMark,
        newMark,
      ];
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
    let result = [];
    studentData.forEach((student) => {
      student.quaterMark.forEach((mark) => {
        if (mark.update_flag)
          result.push({
            id: mark.id,
            mark: mark.mark,
            period: mark.period,
            relationId: student.id,
          });
      });
    });
    return result;
  };

  const createQuaterClearData = () => {
    let result = [];
    studentData.forEach((student) => {
      student.quaterMark.forEach((mark) => {
        if (mark.delete_flag && mark.id !== 0) result.push(mark.id);
      });
    });
    return result;
  };

  let {
    loading,
    data: studentData,
    error,
    refetch,
    networkStatus,
  } = useQuery(FETCH_JOURNAL_QUERY, {
    variables: {
      teacherId: props.location.state?.teacher || auth.user?.teacher,
      courseId: userCourses[course].id,
      year: moment().month() > 7 ? moment().year() : moment().year() - 1,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const [update] = useMutation(UPDATE_JOURNAL_MUTATION);

  const save = async () => {
    await update({
      variables: {
        data: {
          updateCasual: createUpdateData(),
          updatePeriod: createQuaterData(),
          deleteCasual: createClearData(),
          deletePeriod: createQuaterClearData(),
        },
      },
    });

    refetch();
  };

  const spinner = <div>Загрузка</div>;

  if (error) throw new Error(503);
  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;
  studentData = studentData.fetchJournal.map((student) => ({
    ...student,
    journalEntry: [
      ...student.journalEntry.map((entry) => ({
        ...entry,
        delete_flag: false,
        update_flag: false,
      })),
    ],
  }));

  if (studentData[0].student === null) {
    return <p>Здесь пока нет данных</p>;
  }
  let groupedData = [];

  //TODO possible bottleneck
  if (userCourses[course].group) {
    let pairs = [];
    let classes = [];
    let programs = [];
    let subgroups = [];
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
          item.subgroup === (pair.subgroup || null)
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
    const dates = [
      ...new Set(
        group.students
          .map((student) => student.journalEntry.map((item) => item.date))
          .flat()
      ),
    ];

    const mappedDates = new Map(period.data.map((it) => [`${it.id}`, []]));

    const result = [];

    dates.forEach((date) => {
      if (date) {
        const month = getMonthFromUTCString(date);

        const datesArray = mappedDates.get(month);

        if (datesArray) {
          mappedDates.set(month, [...datesArray, { date, month }]);
        }
      }
    });

    mappedDates.forEach((value, key) => {
      console.log(key);
      const maxDates = key === '1' ? 4 : 5;
      const emptyCount = maxDates - value.length;
      result.push(
        ...value,
        ...times(emptyCount, () => ({ date: '', month: key }))
      );
    });

    return result;
  });

  const updateDates = ({ date, column, group }) => {
    date = date.toLocaleDateString('ru-RU');
    date = date.split('.');
    date = `${date[2]}-${date[1]}-${date[0]}`.concat('T00:00:00.000Z');

    const oldDate = dates_by_group[group][column].date;

    let students = groupedData[group].students.map((item) => item.id); //all group student ids

    students = students.filter((student) =>
      studentData
        .find((item) => item.id === student)
        ?.journalEntry.find((mark) => mark.date === oldDate)
    );

    students.forEach((studentIndex) => {
      const student = studentData.find((item) => item.id === studentIndex);
      const marks = student.journalEntry;
      const cell = marks.find((el) => el.date === oldDate);

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
                date: date,
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
      <TableControls
        initialMonth={startDate.month()}
        setMonth={setMonth}
        save={save}
        courses={userCourses}
        course={course}
        setCourse={setCourse}
        setPeriod={userCourses[course].group ? setPeriod : undefined}
        period={userCourses[course].group ? period : undefined}
        refetch={() => refetch()}
      />
      {userCourses[course].group ? (
        <GroupJournalView
          dates_by_group={dates_by_group}
          groupedData={groupedData}
          period={period}
          updateDates={updateDates}
          updateMyData={updateMyData}
          updateQuarterData={updateQuarterData}
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

const createDates = (initialDate) => {
  let result = [];
  let start = initialDate.clone().startOf('month');
  let end = initialDate.clone().endOf('month');

  for (let date = start; date <= end; date.add(1, 'day')) {
    if (date.isoWeekday() !== 7) result.push(date.clone());
  }
  return result;
};

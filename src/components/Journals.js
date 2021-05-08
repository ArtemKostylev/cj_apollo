import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { FETCH_JOURNAL_QUERY, FETCH_TEACHERS_QUERY } from "../scripts/queries";
import "../styles/Teachers.css";
import moment from "moment";
import { QUATERS, QUATERS_RU } from "../scripts/constants";
import { getQuater } from "../scripts/utils";
import Controls from "./Controls";

export default function Teachers(props) {
  const [teacherIndex, setTeacherIndex] = useState(1);
  const [period, setPeriod] = useState(getQuater(moment().month()));
  const [year, setYear] = useState(moment().year());
  const [course, setCourse] = useState(0);

  const spinner = <div>Загрузка</div>;

  const { loading: tcLoading, data: teachers } = useQuery(FETCH_TEACHERS_QUERY);

  if (tcLoading) return spinner;

  const ListItem = (props) => {
    return (
      <li tabIndex="0" onClick={() => setTeacherIndex(props.index)}>
        <p>{props.name}</p>
      </li>
    );
  };

  const extrudeDate = (date) => {
    const [month, day] = date.split("T")[0].split("-").slice(1);
    return `${day}/${month}`;
  };

  const StudentItem = (props) => {
    const cells = Array(props.cells)
      .fill()
      .map((x, i) => i);
    return (
      <div className="teacher_item">
        <div className="item_header">
          <p>{props.name}</p>
          <p>{props.hours}</p>
        </div>
        <div className="item_data">
          <table>
            <thead>
              <tr>
                {cells.map((cell) => (
                  <th key={cell}>
                    {props.dates[cell] ? extrudeDate(props.dates[cell]) : "..."}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {cells.map((cell) => (
                  <td key={cell}>
                    {props.marks[cell] ? props.marks[cell] : " "}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const TeacherJournal = (props) => {
    const { loading, data: journal, error, refetch, networkStatus } = useQuery(
      FETCH_JOURNAL_QUERY,
      {
        variables: {
          courseId: props.courseId,
          teacherId: props.teacherIndex,
          date_gte: moment()
            .month(QUATERS[props.period][0])
            .year(props.year)
            .startOf("month")
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss.SSS")
            .concat("Z"),
          date_lte: moment()
            .month(QUATERS[props.period].slice(-1)[0])
            .year(props.year)
            .endOf("month")
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss.SSS")
            .concat("Z"),
        },
        fetchPolicy: "network-only",
      }
    );

    if (loading) return spinner;

    return journal.fetchJournal.map((item) => {
      const name = `${item.student.name} ${item.student.surname}`;
      const hours = `${item.journalEntry.length}`;
      const dates = item.journalEntry.map((entry) => entry.date);
      const marks = item.journalEntry.map((entry) => entry.mark);
      return (
        <StudentItem
          name={name}
          hours={hours}
          dates={dates}
          marks={marks}
          cells={15}
          key={name}
        />
      );
    });
  };

  const getYear = (e) => {
    setYear(e.target.value);
  };

  const getPeriod = (e) => {
    setPeriod(e.target.getAttribute("data-index"));
  };

  const getCourse = (e) => {
    setCourse(e.target.getAttribute("data-index"));
  };

  const items = [
    {
      type: "input",
      label: "Год :",
      text: year,
      onClick: getYear,
    },
    {
      type: "dropdown",
      data: QUATERS_RU,
      label: "Период :",
      text: QUATERS_RU[period],
      onClick: getPeriod,
    },
    {
      type: "dropdown",
      data: teachers.fetchTeachers
        .find((teacher) => teacher.id === teacherIndex)
        .relations.map((item) => item.course.name),
      label: "Предмет :",
      text: teachers.fetchTeachers.find(
        (teacher) => teacher.id === teacherIndex
      ).relations[course].course.name,
      onClick: getCourse,
    },
  ];

  return (
    <div className="page">
      <div className="block_left">
        <ul>
          {teachers.fetchTeachers.map((teacher) => (
            <ListItem
              name={`${teacher.name} ${teacher.surname}`}
              index={teacher.id}
              key={teacher.id}
            />
          ))}
        </ul>
      </div>
      <div className="block_right">
        <Controls items={items} />
        <TeacherJournal
          teacherIndex={teacherIndex}
          period={period}
          year={year}
          key={teacherIndex}
          courseId={
            teachers.fetchTeachers.find(
              (teacher) => teacher.id === teacherIndex
            ).relations[course].course.id
          }
        />
      </div>
    </div>
  );
}

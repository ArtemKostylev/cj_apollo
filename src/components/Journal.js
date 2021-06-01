//TODO create table component

//table library url https://react-table.tanstack.com/docs/examples/editable-studentData
import React, { useEffect, useState } from "react";
import "../styles/Journal.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import moment from "moment";
import "moment/locale/ru";
import { EditableCell } from "./EditableCell";
import { TableControls } from "./TableControls";
import {
  useMutation,
  useQuery,
  NetworkStatus,
  useApolloClient,
} from "@apollo/client";
import { FETCH_JOURNAL_QUERY } from "../scripts/queries";
import { useAuth } from "../scripts/use-auth";
import { UPDATE_JOURNAL_MUTATION } from "../scripts/mutations";
import {
  PROGRAMS,
  GROUP_PERIODS,
  QUATER_END,
  QUATERS_RU,
} from "../scripts/constants";
import { EditableDateCell } from "./EditableDateCell";
import { useHistory } from "react-router-dom";
import { Prompt } from "react-router";

export default function Journal(props) {
  moment.locale("ru");

  let auth = useAuth();
  let history = useHistory();

  const [month, setMonth] = React.useState(moment().month());
  const [course, setCourse] = useState(0);
  let changed = false;

  const [period, setPeriod] = useState(
    month > 8 ? GROUP_PERIODS["first_half"] : GROUP_PERIODS["second_half"]
  );

  const listener = (event) => {
    if (changed) {
      event.preventDefault();
      let confirm = window.confirm(
        "Вы действительно хотите покинуть страницу? Все несохраненные изменения будут потеряны."
      );
      if (!confirm) event.stopImmediatePropagation();
    }
  };

  useEffect(() => {
    props.menuRef?.current.addEventListener("click", listener);

    return () => {
      props.menuRef?.current?.removeEventListener("click", listener);
    };
  });

  const startDate = moment().month(month);

  const parsedDates = createDates(startDate);

  const updateMyData = (row, column, value, group) => {
    let date = "";
    console.log(group);
    if (group > -1) {
      date = dates_by_group[group][column].date;
      if (date === "") {
        alert("Пожалуйста, заполните дату");
        return false;
      }
    } else {
      date = parsedDates[column].format("YYYY-MM-DD");
    }
    const student = studentData.find((item) => item.student.id === row);
    const marks = student.journalEntry;
    const cell = marks.find((el) => el.date.split("T")[0] === date);

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
              date: date.concat("T00:00:00.000Z"),
              delete_flag: false,
              update_flag: true,
            },
          ],
        },
        ...studentData.slice(studentId + 1),
      ];
    } else {
      let index = marks.indexOf(cell);
      let flag = value === "";
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
    console.log(studentData, value);
    return true;
  };

  const updateQuaterData = (row, column, value, group) => {
    const student = studentData.find((item, index) => item.student.id === row);
    const studentIndex = studentData.indexOf(student);
    var mark = student.quaterMark.find((item) => item.period === column);
    if (!mark) {
      const newMark = {
        id: 0,
        mark: value,
        period: column,
        studentId: student.id,
        teacherId: auth.user.teacher,
        courseId: auth.user.courses[course].id,
        update_flag: true,
      };
      studentData[studentIndex].quaterMark = [
        ...studentData[studentIndex].quaterMark,
        newMark,
      ];
      return true;
    }
    const markIndex = student.quaterMark.indexOf(mark);
    let flag = value === "";
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

  var { loading, data: studentData, error, refetch, networkStatus } = useQuery(
    FETCH_JOURNAL_QUERY,
    {
      variables: {
        teacherId: props.id ? props.id : auth.user.teacher,
        courseId: auth.user.courses[course].id,
        date_gte: startDate
          .clone()
          .startOf("year")
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss.SSS")
          .concat("Z"),
        date_lte: startDate
          .clone()
          .endOf("year")
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss.SSS")
          .concat("Z"),
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

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

  if (error) history.push("/error");
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

  let groupedData = [];

  //TODO add subgroup tag
  if (auth.user.courses[course].group) {
    let pairs = [];
    let classes = [];
    let programs = [];
    let subgroups = [];
    studentData.forEach((item) => {
      classes.push(item.student.class);
      programs.push(item.student.program);
      subgroups.push(item.subgroup ? item.subgroup : "");
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
          item.subgroup === pair.subgroup
      );
      pairs[pairIndex].students.push(item);
    });

    pairs.forEach((pair) => {
      if (pair.students.length > 0) groupedData.push(pair);
    });
  }

  //inside groupedData we divide them by subgroups

  var dates_by_group = groupedData.map((group) => {
    var month_id = period.data[0].id;
    var dates = group.students.map((student) =>
      student.journalEntry.map((entry) => entry.date)
    );
    var result = [];
    const len = period.id === 0 ? 20 : 24;
    if (dates[0].length === 0) {
      var counter = 1;
      for (var i = 0; i < len; i++) {
        var border = month_id === 1 ? 4 : 5;
        if (counter >= border) {
          counter = 1;
          result.push({ date: "", month: month_id });
          month_id++;
          continue;
        }
        result.push({ date: "", month: month_id });
        counter++;
      }
      return result;
    }

    dates = [...new Set(dates.flat())].values();
    var counter = 1;

    var date = dates.next().value;
    var month = parseInt(date.split("T")[0].split("-")[1]);
    for (var i = 0; i < len; i++) {
      var border = month_id === 1 ? 4 : 5;
      if (counter < border && month === month_id) {
        result.push({ date: date, month: month_id });
        date = dates.next().value;
        if (!date) {
          month = 0;
          continue;
        }
        month = parseInt(date.split("T")[0].split("-")[1]);
        counter++;
        continue;
      }
      if (counter < border && month !== month_id) {
        counter++;
        result.push({ date: "", month: month_id });
        continue;
      }
      if (counter >= border && month !== month_id) {
        counter = 1;
        result.push({ date: "", month: month_id });
        month_id++;
        continue;
      }
      if (counter >= border) {
        counter = 1;
        result.push({ date: date, month: month_id });
        date = dates.next().value;
        if (!date) {
          month = 0;
          continue;
        }
        month = parseInt(date.split("T")[0].split("-")[1]);
        month_id++;
      }
    }
    return result;
  });

  const updateDates = (input, index, group) => {
    var date = input.toLocaleDateString("ru-RU");
    date = date.split(".");
    date = `${date[2]}-${date[1]}-${date[0]}`;
    dates_by_group[group][index].date = date.concat("T00:00:00.000Z");
  };

  const prepareQuaters = () => {
    if (period.id === 0) {
      return ["first", "second"];
    } else return ["third", "fourth", "year"];
  };

  const GroupContent = () => (
    <>
      <TableControls
        initialMonth={startDate.month()}
        setMonth={setMonth}
        save={save}
        courses={auth.user.courses}
        course={course}
        setCourse={setCourse}
        setPeriod={setPeriod}
        period={period}
      />
      <table className="journal_table">
        <tbody>
          {dates_by_group.map((group, g_index) => {
            console.log(g_index);
            return (
              <>
                <tr className="group_row">
                  <th colSpan={period.id === 0 ? "23" : "28"}>
                    <div>
                      <p>{`Класс:  ${groupedData[g_index].class}${
                        PROGRAMS[`${groupedData[g_index].program}`]
                      }`}</p>
                      <p>{`Группа: ${groupedData[g_index].subgroup}`}</p>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th className="name_column" rowSpan="2">
                    Имя ученика
                  </th>
                  {period.data.map((month) => (
                    <th colSpan={month.id === 1 ? "4" : "5"}>{month.name}</th>
                  ))}
                  <th rowSpan="2" className="quater_column">
                    {period.id === 0 ? "I четверть" : "II четверть"}
                  </th>
                  <th rowSpan="2" className="quater_column">
                    {period.id === 0 ? "III четверть" : "IV четверть"}
                  </th>
                  {/*                   <th rowSpan="2">
                    {period.id === 0 ? "1-е полугодие" : "2-е полугодие"}
                  </th> */}
                  {period.id === 1 ? (
                    <th rowSpan="2" className="quater_column">
                      Годовая оценка
                    </th>
                  ) : (
                    ""
                  )}
                </tr>

                <tr>
                  {group.map((date, id) => {
                    return (
                      <th className="date">
                        <EditableDateCell
                          initialValue={
                            date.date === ""
                              ? ""
                              : new Date(date.date.split("T")[0])
                          }
                          column={id}
                          month={date.month}
                          group={g_index}
                          updateDates={updateDates}
                          full={false}
                        />
                      </th>
                    );
                  })}
                </tr>
                {groupedData[g_index].students.map((item) => (
                  <tr>
                    <td className="name_cell">{`${item.student.surname} ${item.student.name}`}</td>
                    {group.map((date, index) => (
                      <EditableCell
                        value={findMark(date.date, item.journalEntry)}
                        row={item.student.id}
                        column={index}
                        updateMyData={updateMyData}
                        weekend={""}
                        group={g_index}
                      />
                    ))}
                    {prepareQuaters().map((quat) => {
                      var mark = "";
                      try {
                        mark = item.quaterMark.find(
                          (mark) => mark.period === quat
                        );
                      } catch {
                        mark = "";
                      }

                      return (
                        <EditableCell
                          value={mark ? mark.mark : ""}
                          row={item.student.id ? item.student.id : ""}
                          column={quat}
                          updateMyData={updateQuaterData}
                          weekend={""}
                          group={g_index}
                        />
                      );
                    })}
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );

  if (auth.user.courses[course].group) return <GroupContent />;

  const getQuaterMark = (item) => {
    if (QUATER_END[month]) {
      const mark = item.quaterMark.find(
        (mark) => mark.period === QUATER_END[month]
      );
      const year =
        month === 4
          ? item.quaterMark.find((mark) => mark.period === "year")
          : null;

      return (
        <>
          <EditableCell
            value={mark ? mark.mark : ""}
            row={item.student.id}
            column={mark ? mark.period : QUATER_END[month]}
            updateMyData={updateQuaterData}
          />
          {year !== null ? (
            <EditableCell
              value={year ? year.mark : ""}
              row={item.student.id}
              column={year ? year.period : "year"}
              updateMyData={updateQuaterData}
            />
          ) : (
            ""
          )}
        </>
      );
    }
    return "";
  };

  const IndividualContent = () => (
    <>
      <TableControls
        initialMonth={startDate.month()}
        setMonth={setMonth}
        save={save}
        courses={auth.user.courses}
        course={course}
        setCourse={setCourse}
      />
      <table className="journal_table">
        <thead>
          <tr>
            <th className="name_column" rowSpan="2">
              Имя ученика
            </th>
            <th rowSpan="2">Класс</th>
            {parsedDates.map((date) => (
              <th>{date.format("DD.MM")}</th>
            ))}
            {[2, 4, 9, 11].includes(month) ? (
              <th rowSpan="2" className="quater_column">
                {`${QUATERS_RU[[9, 11, 2, 4].indexOf(month)]}`}
              </th>
            ) : (
              ""
            )}
            {month === 4 ? (
              <th rowSpan="2" className="quater_column">
                {`Год`}
              </th>
            ) : (
              ""
            )}
          </tr>
          <tr>
            {parsedDates.map((date) => (
              <th>{moment.weekdaysMin(date.isoWeekday())}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentData.map((item) => (
            <tr>
              <td className="name_cell">{`${item.student.surname} ${item.student.name}`}</td>
              <td className="name_cell">{`${item.student.class}${
                PROGRAMS[`${item.student.program}`]
              }`}</td>
              {parsedDates.map((date, index) => (
                <EditableCell
                  value={findMark(date, item.journalEntry)}
                  row={item.student.id}
                  column={index}
                  updateMyData={updateMyData}
                  weekend={date.isoWeekday() === 6 ? "weekend" : ""}
                />
              ))}
              {getQuaterMark(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return <IndividualContent />;
}

const createDates = (initialDate) => {
  let result = [];
  let start = initialDate.clone().startOf("month");
  let end = initialDate.clone().endOf("month");

  for (let date = start; date <= end; date.add(1, "day")) {
    if (date.isoWeekday() !== 7) result.push(date.clone());
  }
  return result;
};

const findMark = (date, student) => {
  console.log(date);
  if (date === "" || !date) return "";
  if (typeof date === "string") date = date.split("T")[0];
  else date = date.format("YYYY-MM-DD");
  const mark = student.find((el) => el.date.split("T")[0] === date);
  return mark !== undefined ? mark.mark : "";
};

import { NetworkStatus, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import React, { useState } from "react";
import { UPDATE_REPLACEMENTS_MUTATION } from "../scripts/mutations";
import { FETCH_REPLACEMENTS_QUERY } from "../scripts/queries";
import { useAuth } from "../scripts/use-auth";
import { EditableCell } from "./EditableCell";
import { EditableDateCell } from "./EditableDateCell";
import { TableControls } from "./TableControls";
import "../styles/Compensation.css";

export default function Compensation(props) {
  let auth = useAuth();

  const [course, setCourse] = useState(0);
  const [month, setMonth] = useState(moment().month());

  var { loading, data, error, refetch, networkStatus } = useQuery(
    FETCH_REPLACEMENTS_QUERY,
    {
      variables: {
        teacherId: props.id ? props.id : auth.user.teacher,
        courseId: auth.user.courses[course].id,
        date_gte: moment()
          .month(month)
          .clone()
          .startOf("month")
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss.SSS")
          .concat("Z"),
        date_lte: moment()
          .month(month)
          .clone()
          .endOf("month")
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss.SSS")
          .concat("Z"),
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  const [update] = useMutation(UPDATE_REPLACEMENTS_MUTATION);

  const save = async () => {

    var result = [];
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

  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;

  if (networkStatus === NetworkStatus.refetch) return spinner;

  var studentData = [];

  data.fetchReplacements.forEach((student) => {
    if (student.journalEntry.length > 0) {
      studentData.push(student);
    }
  });

  const updateDates = (value, id, entry, row) => {

    const student = studentData.find((item, index) => item.student.id === row);
    const studentIndex = studentData.indexOf(student);
    var mark = student.journalEntry.find((item) => item.id === entry);
    const markIndex = student.journalEntry.indexOf(mark);

    let flag = value === "";
    value = value?.toLocaleDateString("ru-RU").split(".");
    const newRepl = {
      id: !mark.replacement ? 0 : id,
      date: `${value[2]}-${value[1]}-${value[0]}`.concat("T00:00:00.000Z"),
      entryId: entry,
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
        courses={auth.user.courses}
        course={course}
        setCourse={setCourse}
      />
      <table className="compensation_table">
        <thead>
          <tr>
            <th className="name_column">Имя ученика</th>
            {Array(10)
              .fill(1)
              .map((item, index) => (
                <>
                  <th>Пропуск</th>
                  <th>Выдано</th>
                </>
              ))}
          </tr>
        </thead>
        <tbody>
          {studentData.map((item) => {
            return (
              <tr>
                <td className="name_cell">{`${item.student.surname} ${item.student.name}`}</td>
                {Array(10)
                  .fill(1)
                  .map((num, index) => {
                    var lesson = null;
                    var lesson_date = null;
                    var repl = null;
                    if (item.journalEntry[index]) {
                      lesson = item.journalEntry[index]
                      lesson_date = lesson.date.split("T")[0];
                      if (lesson.replacement) repl = lesson.replacement;
                    }

                    return (
                      <>
                        <td className="name_cell">
                          {lesson_date ? `${lesson_date.split("-")[2]}.${lesson_date.split("-")[1]}.${lesson_date.split("-")[0]}` : ""}
                        </td>
                        <td>
                          {lesson ? (
                            <EditableDateCell
                              initialValue={
                                repl ? new Date(repl.date.split("T")[0]) : ""
                              }
                              column={repl ? repl.id : 0}
                              group={lesson.id}
                              month={month + 1}
                              row={item.student.id}
                              updateDates={updateDates}
                            />
                          ) : (
                            ""
                          )}
                        </td>
                      </>
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

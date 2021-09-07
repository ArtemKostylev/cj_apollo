import React from "react";
import { QUATER_END, QUATERS_RU, PROGRAMS } from "../../../scripts/constants";
import { findMark } from "./JournalPageHelpers";
import moment from "moment";
import "../../../styles/Journal.css";
import EditableCell from "../../../components/EditableCell";

const IndividualJournalView = ({
  parsedDates,
  month,
  updateQuaterData,
  updateMyData,
  studentData,
}) => {
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

  return (
    <>
      <table className="journal_table">
        <thead>
          <tr>
            <th className="name_column" rowSpan="2">
              Имя ученика
            </th>
            <th rowSpan="2">Класс</th>
            {parsedDates.map((date) => (
              <th key={date}>{date.format("DD.MM")}</th>
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
              <th key={date}>{moment.weekdaysMin(date.isoWeekday())}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentData
            .sort((a, b) => {
              if (a.student.class < b.student.class) return -1;
              if (a.student.class > b.student.class) return 1;
              return 0;
            })
            .map((item) => (
              <tr key={item.student.id}>
                <td
                  className="name_cell"
                  style={{ color: item.archived ? "gray" : "black" }}
                >{`${item.student.surname} ${item.student.name} ${
                  item.archived ? "(A)" : ""
                }`}</td>
                <td
                  className="name_cell"
                  style={{ color: item.archived ? "gray" : "black" }}
                >{`${item.student.class}${
                  PROGRAMS[`${item.student.program}`]
                }`}</td>
                {parsedDates.map((date, index) => (
                  <EditableCell
                    key={date}
                    value={findMark(date, item.journalEntry)}
                    row={item.student.id}
                    column={index}
                    updateMyData={updateMyData}
                    weekend={date.isoWeekday() === 6 ? "weekend" : ""}
                    disabled={item.archived}
                  />
                ))}
                {getQuaterMark(item)}
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default IndividualJournalView;

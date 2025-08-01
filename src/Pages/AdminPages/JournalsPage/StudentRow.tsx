import { useMemo } from "react";
import { getQuarter } from "../../../utils/academicDate";
import moment from "moment";
import { Quarters, QUARTERS_RU } from "../../../constants/date";

interface Props {
  rowLength: number;
  dates: string[];
  archived: boolean;
  studentName: string;
  lessonsCount: number;
  marks: string[];
  quarterMarks: QuarterMark[];
}

const formatDate = (date: string | undefined) => {
  if (!date) return "...";
  const [month, day] = date.split("T")[0].split("-").slice(1);
  return `${day}.${month}`;
};

export const StudentRow = (props: Props) => {
  const {
    rowLength,
    dates,
    archived,
    studentName,
    lessonsCount,
    marks,
    quarterMarks,
  } = props;

  const cells = useMemo(
    () =>
      Array(rowLength)
        .fill(0)
        .map((_, index) => index),
    [rowLength]
  );
  const quarter = useMemo(() => getQuarter(moment().month()), []);

  return (
    <div className="teacher_item">
      <div className="item_header">
        <p>{studentName}</p>
        <p>{archived ? "(A)" : ""}</p>
        <p>{`Выдано уроков: ${lessonsCount}`}</p>
      </div>
      <div className="item_data">
        <table>
          <thead>
            <tr>
              {cells.map((cellIndex) => (
                <th key={cellIndex}>{formatDate(dates[cellIndex])}</th>
              ))}
              <th
                style={{ width: "10%", whiteSpace: "nowrap", margin: "10px" }}
              >
                {QUARTERS_RU[quarter]}
              </th>
              {quarter !== Quarters.FOURTH || (
                <th
                  style={{ width: "5%", whiteSpace: "nowrap", margin: "10px" }}
                >
                  Год
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              {cells.map((cell) => (
                <td style={{ color: archived ? "gray" : "black" }} key={cell}>
                  {marks[cell] ? marks[cell] : " "}
                </td>
              ))}
              <td>
                {quarterMarks.find((item) => item.period === quarter)?.mark ||
                  ""}
              </td>
              {quarter !== Quarters.FOURTH || (
                <td>
                  {quarterMarks.find((item) => item.period === Quarters.YEAR)
                    ?.mark || ""}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

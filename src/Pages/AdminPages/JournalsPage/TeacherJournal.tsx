import { useQuery } from "@apollo/client/react";
import { LegacySpinner } from "../../../ui/LegacySpinner";
import { StudentRow } from "./StudentRow";
import { FETCH_JOURNAL_QUERY } from "../../../graphql/queries/fetchJournal";
import moment from "moment";
import { NetworkStatus } from "@apollo/client";
import {
  getCurrentAcademicYear,
  getQuarter,
} from "../../../utils/academicDate";
import { MONTHS_IN_QUARTERS, Quarters } from "../../../constants/date";
import { QUARTERS } from "../../../constants/quarters";

interface Props {
  courseId: number;
  teacherIndex: number;
}

export const TeacherJournal = (props: Props) => {
  const { courseId, teacherIndex } = props;

  const quarter = getQuarter(moment().month());
  const year = getCurrentAcademicYear();

  const yearForDates = [Quarters.THIRD, Quarters.FOURTH].includes(quarter)
    ? year + 1
    : year;

  const {
    loading,
    data: journal,
    error,
    networkStatus,
  } = useQuery(FETCH_JOURNAL_QUERY, {
    variables: {
      courseId,
      teacherId: teacherIndex,
      date_gte: moment()
        .month(MONTHS_IN_QUARTERS[quarter][0])
        .year(yearForDates)
        .startOf("month")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS")
        .concat("Z"),
      date_lte: moment()
        .month(MONTHS_IN_QUARTERS[quarter].slice(-1)[0])
        .year(yearForDates)
        .endOf("month")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS")
        .concat("Z"),
      year,
    },
    fetchPolicy: "network-only",
  });

  if (props.courseId === 0) {
    return <p>На данный момент для этого учителя нет данных</p>;
  }

  if (loading) return <LegacySpinner />;
  if (networkStatus === NetworkStatus.refetch) return <LegacySpinner />;

  if (error) throw new Error("503");

  if (journal.fetchJournal[0].student === null) {
    return <p>Для данного предмета еще не назначены ученики</p>;
  }

  return journal.fetchJournal.map((item: TeacherCourseStudent) => {
    const name = `${item.student.surname} ${item.student.name}`;
    const hours = item.hours || 0;
    const dates = item.journalEntry.map((entry) => entry.date);
    const marks = item.journalEntry.map((entry) => entry.mark);
    const quarterMarks = item.quaterMark;
    const archived = item.archived || false;

    return (
      <StudentRow
        studentName={name}
        lessonsCount={hours}
        dates={dates}
        marks={marks}
        rowLength={15}
        quarterMarks={quarterMarks}
        key={name}
        archived={archived}
      />
    );
  });
};

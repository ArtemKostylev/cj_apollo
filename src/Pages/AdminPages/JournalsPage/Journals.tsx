import { memo, useMemo, useState } from "react";
import "../../../styles/Journals.css";
import { TeacherJournal } from "./TeacherJournal";
import { TeacherListItem } from "./TeacherListItem";
import { LegacySpinner } from "../../../ui/LegacySpinner";
import { getAllTeachers } from "../../../api/teacher";
import { useQuery } from "@tanstack/react-query";

export const Journals = memo(() => {
  const [teacherIndex, setTeacherIndex] = useState<number | undefined>();

  const {
    isPending,
    isError,
    data: teachers,
  } = useQuery({
    queryKey: ["allTeachers"],
    queryFn: getAllTeachers,
  });

  const courseId = useMemo(() => {
    return (
      teachers?.find(
        (teacher) => teacher.id === (teacherIndex || teachers[0].id)
      )?.relations[0]?.course?.id || 0
    );
  }, [teacherIndex, teachers]);

  if (isPending) return <LegacySpinner />;
  if (isError) throw new Error("503");

  return (
    <div className="page">
      <div className="block_left">
        <ul>
          {teachers.map((teacher) => (
            <TeacherListItem
              key={teacher.id}
              teacherName={`${teacher.surname} ${teacher.name} ${
                teacher?.parent || ""
              }`}
              active={teacherIndex === teacher.id}
              onClick={() => setTeacherIndex(teacher.id)}
            />
          ))}
        </ul>
      </div>
      <div className="block_right">
        <TeacherJournal
          key={teacherIndex}
          teacherIndex={teacherIndex || teachers[0].id}
          courseId={courseId}
        />
      </div>
    </div>
  );
});

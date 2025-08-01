import { useState, useMemo, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import "../../../styles/Subgroups.css";
import {
  TableControls,
  TableControlsConfig,
  TableControlType,
} from "../../../ui/TableControls";
import { getCurrentAcademicYear } from "../../../utils/academicDate";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSubgroups, saveSubgroups } from "../../../api/subgroup";
import { LegacySpinner } from "../../../ui/LegacySpinner";
import { SubgroupItem } from "./SubgroupItem";

export const Subgroups = () => {
  // TODO: this can be combined into a single hook
  const auth = useAuth();
  const year = useMemo(() => getCurrentAcademicYear(), []);

  const [changedSubgroups, setChangedSubgroups] = useState(
    {} as Record<number, number>
  );

  const userVersionData = auth.user.versions[year];
  // TODO: add types to version data
  const courses = userVersionData.courses.filter((course: any) => course.group);

  const [course, setCourse] = useState(0);

  const teacherId = userVersionData.id;
  const courseId = courses[course]?.id;

  const getCourse = (course: number) => {
    setCourse(course);
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["subgroups", courseId, teacherId],
    queryFn: () => getSubgroups(courseId, teacherId),
  });

  const updateSubgroups = useMutation({
    mutationFn: saveSubgroups,
  });

  const save = useCallback(() => {
    const subgroups = Object.entries(changedSubgroups).map(
      ([group, subgroups]) => ({
        relationId: parseInt(group),
        subgroup: subgroups,
      })
    );
    updateSubgroups.mutate(subgroups);
  }, [changedSubgroups, updateSubgroups]);

  const handleSubgroupChange = useCallback(
    (relationId: number, subgroup: number) => {
      setChangedSubgroups((prev) => ({
        ...prev,
        [relationId]: subgroup,
      }));
    },
    []
  );

  const controlsConfig: TableControlsConfig = useMemo(
    () => [
      {
        type: TableControlType.SELECT,
        options: new Map(
          courses.map((it, index) => [index, { value: index, text: it?.name }])
        ),
        text: courses[course]?.name,
        onClick: getCourse,
      },
      {
        type: TableControlType.BUTTON,
        text: "Сохранить",
        onClick: save,
      },
    ],
    [courses, course, data]
  );

  if (isPending) return <LegacySpinner />;
  if (isError) throw new Error("503");

  return (
    <div>
      <TableControls config={controlsConfig} />
      <div className="group_wrapper">
        <ul className="group_list">
          {data.map((subgroup, index) => (
            <>
              <li className="group_header">Класс: {subgroup.subgroupName}</li>
              {subgroup.students.map((item) => (
                <SubgroupItem
                  key={item.relationId}
                  relationId={item.relationId}
                  subgroup={item.subgroup}
                  studentName={item.studentName}
                  onChange={handleSubgroupChange}
                />
              ))}
            </>
          ))}
        </ul>
      </div>
    </div>
  );
};

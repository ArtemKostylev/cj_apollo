import { FETCH_FULL_INFO } from "../scripts/queries";
import { NetworkStatus, useMutation, useQuery } from "@apollo/client";
import DataPageView from "./DataPageView.js";
import {
  CREATE_COURSE_MUTATION,
  CREATE_STUDENT_MUTATION,
  CREATE_TEACHER_MUTATION,
  DELETE_COURSE_MUTATION,
  DELETE_STUDENT_MUTATION,
  DELETE_TEACHER_MUTATION,
  UPDATE_COURSE_MUTATION,
  UPDATE_COURSE_RELATIONS_MUTATION,
  UPDATE_STUDENT_MUTATION,
  UPDATE_STUDENT_RELATIONS_MUTATION,
  UPDATE_TEACHER_MUTATION,
} from "../scripts/mutations";

export default function DataPageController(props) {
  var { loading, data, error, refetch, networkStatus } = useQuery(
    FETCH_FULL_INFO,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  const [updateTeacher] = useMutation(UPDATE_TEACHER_MUTATION);
  const [updateCourse] = useMutation(UPDATE_COURSE_MUTATION);
  const [updateStudent] = useMutation(UPDATE_STUDENT_MUTATION);

  const [createTeacher] = useMutation(CREATE_TEACHER_MUTATION);
  const [createCourse] = useMutation(CREATE_COURSE_MUTATION);
  const [createStudent] = useMutation(CREATE_STUDENT_MUTATION);

  const [deleteTeacher] = useMutation(DELETE_TEACHER_MUTATION);
  const [deleteCourse] = useMutation(DELETE_COURSE_MUTATION);
  const [deleteStudent] = useMutation(DELETE_STUDENT_MUTATION);

  const [updateCourseRelations] = useMutation(UPDATE_COURSE_RELATIONS_MUTATION);
  const [updateStudentRelations] = useMutation(
    UPDATE_STUDENT_RELATIONS_MUTATION
  );

  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;

  let { teachers, courses, students, relations } = data.fetchFullInfo;

  relations = relations.map((el) => ({
    teacher: el.teacher.id,
    course: el.course.id,
    student: el.student?.id || 0,
    archived: el.archived,
  }));

  const update = async (type, values) => {
    switch (type) {
      case "teacher":
        await updateTeacher({
          variables: {
            data: {
              id: values.id,
              name: values.name,
              surname: values.surname,
            },
          },
        });
        break;
      case "course":
        await updateCourse({
          variables: {
            data: {
              id: values.id,
              name: values.name,
              group: values.group,
            },
          },
        });

        break;

      case "student":
        await updateStudent({
          variables: {
            data: {
              id: values.id,
              name: values.name,
              surname: values.surname,
              class: parseInt(values.classNum),
            },
          },
        });
        break;

      default:
        return false;
    }
    refetch();
  };

  const clear = async (type, id) => {
    switch (type) {
      case "teacher":
        await deleteTeacher({
          variables: {
            id: id,
          },
        });
        break;

      case "course":
        await deleteCourse({
          variables: {
            id: id,
          },
        });
        break;

      case "student":
        await deleteStudent({
          variables: {
            id: id,
          },
        });
        break;
      default:
        return false;
    }
    refetch();
  };

  const updateCourseRelationsMutation = async (teacher, courses) => {
    await updateCourseRelations({
      variables: {
        teacher: teacher,
        courses: courses,
      },
    });
    refetch();
  };

  const updateStudentRelationsMutation = async (teacher, course, students) => {
    await updateStudentRelations({
      variables: {
        teacher: teacher,
        course: course,
        students: students,
      },
    });
  };

  return (
    <DataPageView
      teachers={teachers}
      courses={courses}
      students={students}
      relations={relations}
      update={update}
      clear={clear}
      refetch={refetch}
      createTeacher={createTeacher}
      createCourse={createCourse}
      createStudent={createStudent}
      updateCourseRelations={updateCourseRelationsMutation}
      updateStudentRelations={updateStudentRelationsMutation}
    />
  );
}

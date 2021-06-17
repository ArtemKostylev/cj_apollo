import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($login: String!, $password: String!) {
    signin(login: $login, password: $password) {
      token
      user {
        roleId
        teacher {
          id
          relations {
            course {
              id
              name
              group
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_JOURNAL_MUTATION = gql`
  mutation updateJournalMutation($data: JournalUpdateInput) {
    updateJournal(data: $data)
  }
`;

export const UPDATE_REPLACEMENTS_MUTATION = gql`
  mutation updateReplacementsMutation($data: [ReplacementInput]) {
    updateReplacements(data: $data) {
      id
      date
    }
  }
`;

export const UPDATE_NOTE_MUTATION = gql`
  mutation updateNoteMutation($data: NoteInput) {
    updateNote(data: $data) {
      id
      text
    }
  }
`;

export const UPDATE_CONSULTS_MUTATION = gql`
  mutation updateConsultsMutation($data: [ConsultInput]) {
    updateConsults(data: $data) {
      id
      date
    }
  }
`;

export const DELETE_CONSULTS_MUTATION = gql`
  mutation deleteConsultsMutation($ids: [Int!]!) {
    deleteConsults(ids: $ids)
  }
`;

export const UPDATE_SUBGROUPS_MUTATION = gql`
  mutation updateSubgroupsMutation($data: [SubgroupInput]) {
    updateSubgroups(data: $data) {
      subgroup
    }
  }
`;

export const UPDATE_TEACHER_MUTATION = gql`
  mutation updateTeacherMutation($data: TeacherInput) {
    updateTeacher(data: $data) {
      id
      name
      surname
    }
  }
`;

export const UPDATE_COURSE_MUTATION = gql`
  mutation updateCourseMutation($data: CourseInput) {
    updateCourse(data: $data) {
      id
      name
      group
    }
  }
`;

export const UPDATE_STUDENT_MUTATION = gql`
  mutation updateStudentMutation($data: StudentInput) {
    updateStudent(data: $data) {
      id
      name
      surname
      class
      program
    }
  }
`;

export const CREATE_TEACHER_MUTATION = gql`
  mutation createTeacherMutation($data: TeacherInput) {
    createTeacher(data: $data) {
      id
      name
      surname
    }
  }
`;

export const CREATE_COURSE_MUTATION = gql`
  mutation createCourseMutation($data: CourseInput) {
    createCourse(data: $data) {
      id
      name
      group
    }
  }
`;

export const CREATE_STUDENT_MUTATION = gql`
  mutation createStudentMutation($data: StudentInput) {
    createStudent(data: $data) {
      id
      name
      surname
      class
      program
    }
  }
`;

export const DELETE_TEACHER_MUTATION = gql`
  mutation deleteTeacherMutation($id: Int) {
    deleteTeacher(id: $id)
  }
`;

export const DELETE_COURSE_MUTATION = gql`
  mutation deleteCourseMutation($id: Int) {
    deleteCourse(id: $id)
  }
`;

export const DELETE_STUDENT_MUTATION = gql`
  mutation deleteStudentMutation($id: Int) {
    deleteStudent(id: $id)
  }
`;

export const UPDATE_COURSE_RELATIONS_MUTATION = gql`
  mutation updateCourseRelationsMutation(
    $teacher: Int
    $courses: [CourseRelationInput]
  ) {
    updateCourseRelations(teacher: $teacher, courses: $courses)
  }
`;

export const UPDATE_STUDENT_RELATIONS_MUTATION = gql`
  mutation updateStudentRelationsMutation(
    $teacher: Int
    $course: Int
    $students: [StudentRelationInput]
  ) {
    updateCourseRelations(
      teacher: $teacher
      course: $course
      students: $students
    )
  }
`;

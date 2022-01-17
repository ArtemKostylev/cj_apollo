import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($login: String!, $password: String!) {
    signin(login: $login, password: $password) {
      token
      user {
        role {
          name
        }
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

export const UPDATE_GROUP_CONSULTS_MUTATION = gql`
  mutation updateGroupConsultsMutation(
    $data: [GroupConsultInput]
    $teacher: Int
    $course: Int
  ) {
    updateGroupConsults(teacher: $teacher, course: $course, data: $data) {
      id
      date
    }
  }
`;

export const DELETE_GROUP_CONSULTS_MUTATION = gql`
  mutation deleteGroupConsultsMutation($ids: [Int!]!) {
    deleteGroupConsults(ids: $ids)
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
      parent
    }
  }
`;

export const UPDATE_COURSE_MUTATION = gql`
  mutation updateCourseMutation($data: CourseInput) {
    updateCourse(data: $data) {
      id
      name
      group
      excludeFromReport
      onlyHours
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
      specialization {
        id
      }
    }
  }
`;

export const UPDATE_SPECIALIZATION_MUTATION = gql`
  mutation updateSpecializationMutation($data: SpecializationInput) {
    updateSpecialization(data: $data)
  }
`;

export const CREATE_TEACHER_MUTATION = gql`
  mutation createTeacherMutation($data: TeacherInput) {
    createTeacher(data: $data) {
      id
      name
      surname
      parent
    }
  }
`;

export const CREATE_COURSE_MUTATION = gql`
  mutation createCourseMutation($data: CourseInput) {
    createCourse(data: $data) {
      id
      name
      group
      excludeFromReport
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

export const DELETE_SPECIALIZATION_MUTATION = gql`
  mutation deleteSpecializationMutation($id: Int) {
    deleteSpecialization(id: $id)
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
    updateStudentRelations(
      teacher: $teacher
      course: $course
      students: $students
    )
  }
`;

export const UPLOAD_TEACHERS_FROM_FILE = gql`
  mutation uploadTeachersFromFileMutation($file: Upload!) {
    uploadTeachersFromFile(file: $file)
  }
`;

export const UPLOAD_COURSES_FROM_FILE = gql`
  mutation uploadCoursesFromFileMutation($file: Upload!) {
    uploadCoursesFromFile(file: $file)
  }
`;

export const UPLOAD_STUDENTS_FROM_FILE = gql`
  mutation uploadStudentsFromFileMutation($file: Upload!) {
    uploadStudentsFromFile(file: $file)
  }
`;

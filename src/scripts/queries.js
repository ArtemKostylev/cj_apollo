import { gql } from "@apollo/client";

export const FETCH_JOURNAL_QUERY = gql`
  query fetchJournalQuery(
    $courseId: Int!
    $teacherId: Int!
    $date_gte: Date!
    $date_lte: Date!
  ) {
    fetchJournal(
      courseId: $courseId
      teacherId: $teacherId
      date_gte: $date_gte
      date_lte: $date_lte
    ) {
      id
      student {
        id
        name
        surname
        class
        program
      }
      subgroup
      journalEntry {
        id
        mark
        date
      }
      quaterMark {
        id
        mark
        period
      }
    }
  }
`;

export const FETCH_TEACHERS_QUERY = gql`
  query fetchTeachersQuery {
    fetchTeachers {
      id
      name
      surname
      userId
      relations {
        course {
          id
          name
        }
      }
    }
  }
`;

export const FETCH_REPLACEMENTS_QUERY = gql`
  query fetchReplacementsQuery(
    $teacherId: Int!
    $courseId: Int!
    $date_gte: Date!
    $date_lte: Date!
  ) {
    fetchReplacements(
      teacherId: $teacherId
      courseId: $courseId
      date_gte: $date_gte
      date_lte: $date_lte
    ) {
      id
      student {
        id
        name
        surname
        class
        program
      }
      subgroup
      journalEntry {
        id
        mark
        date
        replacement {
          id
          date
        }
      }
    }
  }
`;

export const FETCH_NOTES_QUERY = gql`
  query fetchNotesQuery(
    $teacherId: Int!
    $courseId: Int!
    $period: String!
    $year: Int!
  ) {
    fetchNotes(
      teacherId: $teacherId
      courseId: $courseId
      period: $period
      year: $year
    ) {
      id
      text
    }
  }
`;

export const FETCH_CONSULTS_QUERY = gql`
  query fetchConsultsQuery(
    $teacherId: Int!
    $courseId: Int!
    $period: String!
    $year: Int!
  ) {
    fetchConsults(
      teacherId: $teacherId
      courseId: $courseId
      year: $year
      period: $period
    ) {
      id
      student {
        id
        name
        surname
        class
        program
      }
      consult {
        id
        date
      }
    }
  }
`;

export const FETCH_SUBGROUPS_QUERY = gql`
  query fetchSubgroupsQuery($teacherId: Int!, $courseId: Int!) {
    fetchSubgroups(teacherId: $teacherId, courseId: $courseId) {
      class
      program
      relations {
        id
        student {
          id
          name
          surname
        }
        subgroup
      }
    }
  }
`;

export const FETCH_STUDENTS_QUERY = gql`
  query fetchStudentsQuery {
    fetchStudents {
      id
      name
      surname
      class
      program
    }
  }
`;

export const FETCH_COURSES_QUERY = gql`
  query fetchCoursesQuery {
    fetchCourses {
      id
      name
      group
    }
  }
`;

export const FETCH_FULL_INFO = gql`
  query fetchFullInfo {
    fetchFullInfo {
      teachers {
        id
        name
        surname
      }
      courses {
        id
        name
        group
      }
      students {
        id
        name
        surname
        class
        program
      }
      relations {
        teacher {
          id
        }
        student {
          id
        }
        course {
          id
        }
      }
    }
  }
`
import { gql } from "@apollo/client";

export const FETCH_JOURNAL_QUERY = gql`
  query fetchJournalQuery(
    $courseId: Int!
    $teacherId: Int!
    $year: Int!
    $date_gte: Date
    $date_lte: Date
  ) {
    fetchJournal(
      courseId: $courseId
      teacherId: $teacherId
      year: $year
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
      archived
      hours
    }
  }
`;

export const FETCH_TEACHERS_QUERY = gql`
  query fetchTeachersQuery {
    fetchTeachers {
      id
      name
      surname
      parent
      userId
      relations {
        course {
          id
          name
          group
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
  query fetchNotesQuery($teacherId: Int!, $courseId: Int!, $year: Int!) {
    fetchNotes(teacherId: $teacherId, courseId: $courseId, year: $year) {
      id
      text
    }
  }
`;

export const FETCH_CONSULTS_QUERY = gql`
  query fetchConsultsQuery($teacherId: Int!, $courseId: Int!, $year: Int!) {
    fetchConsults(teacherId: $teacherId, courseId: $courseId, year: $year) {
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
        hours
        date
      }
    }
  }
`;

export const FETCH_GROUP_CONSULTS_QUERY = gql`
  query fetchGroupConsultsQuery(
    $teacherId: Int!
    $courseId: Int!
    $year: Int!
  ) {
    fetchGroupConsults(
      teacherId: $teacherId
      courseId: $courseId
      year: $year
    ) {
      group
      consults {
        id
        date
        hours
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
        parent
      }
      courses {
        id
        name
        group
        excludeFromReport
      }
      students {
        id
        name
        surname
        class
        program
        specialization {
          id
        }
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
        archived
      }
      specializations {
        id
        name
      }
    }
  }
`;

export const FETCH_GROUP_COMPANY = gql`
  query fetchGroupCompany($teacherId: Int, $courseId: Int) {
    fetchGroupCompany(teacherId: $teacherId, courseId: $courseId) {
      group
      hours {
        id
        date
        hours
      }
    }
  }
`;

export const FETCH_SPECIALIZATIONS = gql`
  query fetchSpecializations {
    fetchSpecializations {
      id
      name
    }
  }
`;

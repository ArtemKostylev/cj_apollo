import {gql} from '@apollo/client';

export const FETCH_TEACHER_STUDENTS = gql`
    query fetchTeacherStudents($teacherId: Int! $year: Int!) {
        fetchTeacherStudents(teacherId: $teacherId, year: $year) {
            id
            name
            surname
            class
            program
        }
    }
`;
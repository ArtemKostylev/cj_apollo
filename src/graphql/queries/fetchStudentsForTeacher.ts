import {gql} from '@apollo/client';

export const FETCH_STUDENTS_FOR_TEACHER = gql`
    query fetchStudentsForTeacher($teacherId: Int! $year: Int!) {
        fetchStudentsForTeacher(teacherId: $teacherId, year: $year) {
            student {
                id
                name
                surname
                class
                program
            }
        }
    }
`;
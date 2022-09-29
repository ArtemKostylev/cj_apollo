import {gql} from '@apollo/client';

export const FETCH_MIDTERM_EXAMS = gql`
    query fetchStudentsForTeacher($teacherId: Int! $year: Int!) {
        fetchStudentsForTeacher(teacherId: $teacherId, year: $year) {
            midtermExam {
                id
                name
                surname
                class
                program
            }
        }
    }
`;
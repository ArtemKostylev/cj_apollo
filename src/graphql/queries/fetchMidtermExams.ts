import {gql} from '@apollo/client';

export const FETCH_MIDTERM_EXAMS = gql`
    query fetchMidtermExams($teacherId: Int! $type: string $dateGte: Date $dateLte: Date) {
        fetchStudentsForTeacher(teacherId: $teacherId, type: $type, dateGte: $dateGte, dateLte: $dateLte) {
            midtermExam {
                id
                date
                mark
                contents
                student {
                    id
                    name
                    surname
                    class
                    program
                }
            }
        }
    }
`;
import {gql} from '@apollo/client';
import {STUDENT_FRAGMENT} from '../fragments/studentFragment';

export const FETCH_MIDTERM_EXAMS = gql`
    ${STUDENT_FRAGMENT}
    query fetchMidtermExams($teacherId: Int!, $year: Int!, $typeId: Int!, $dateGte: Date!, $dateLte: Date!) {
        fetchMidtermExams(teacherId: $teacherId, year: $year, typeId: $typeId, dateGte: $dateGte, dateLte: $dateLte) {
            id
            student {
                ...StudentFragment
            }
            date
            contents
            result
            type {
                id
                name
            }
            number
        }
    }
`;
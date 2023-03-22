import {gql} from '@apollo/client';
import {STUDENT_FRAGMENT} from '../fragments/studentFragment';
import {MIDTERM_EXAM_TYPE_FRAGMENT} from '../fragments/midtermExamType';

export const FETCH_MIDTERM_EXAMS = gql`
    ${STUDENT_FRAGMENT}
    ${MIDTERM_EXAM_TYPE_FRAGMENT}
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
                ...MidtermExamTypeFragment
            }
        }
    }
`;
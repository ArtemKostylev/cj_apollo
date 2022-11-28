import {gql} from '@apollo/client';

export const FETCH_MIDTERM_EXAM_TYPES = gql`
    query fetchMidtermExamTypes {
        fetchMidtermExamTypes {
            id
            name
        }
    }
`
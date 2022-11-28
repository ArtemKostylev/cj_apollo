import {gql} from '@apollo/client';

export const UPDATE_MIDTERM_EXAM_TYPE = gql`
    query updateMidtermExamType {
        updateMidtermExamType {
            id
            name
        }
    }
`
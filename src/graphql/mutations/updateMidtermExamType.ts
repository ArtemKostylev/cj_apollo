import {gql} from '@apollo/client';

export const UPDATE_MIDTERM_EXAM_TYPE = gql`
    mutation updateMidtermExamType($data: MidtermExamTypeInput) {
        updateMidtermExamType(data: $data) {
            id
            name
        }
    }
`
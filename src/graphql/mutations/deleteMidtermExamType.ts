import {gql} from '@apollo/client';

export const DELETE_MIDTERM_EXAM_TYPE = gql`
    mutation deleteMidtermExamType($id: Int) {
        deleteMidtermExamType(id: $id)
        {
            id
            name
        }
    }
`
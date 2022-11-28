import {gql} from '@apollo/client';

export const DELETE_MIDTERM_EXAM_TYPE = gql`
    query deleteMidtermExamType($id: Int) {
        deleteMidtermExamType(id: $id)
    }
`
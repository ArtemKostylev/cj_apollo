import {gql} from "@apollo/client";

export const DELETE_MIDTERM_EXAM = gql`
    mutation deleteMidtermExam($id: Int) {
        deleteMidtermExam(id: $id) {
            id
            number
        }
    }
`;
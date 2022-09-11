import {gql} from "@apollo/client";

export const DELETE_STUDENT_MUTATION = gql`
    mutation deleteStudentMutation($id: Int) {
        deleteStudent(id: $id)
    }
`;
import {gql} from "@apollo/client";

export const DELETE_TEACHER_MUTATION = gql`
    mutation deleteTeacherMutation($id: Int) {
        deleteTeacher(id: $id)
    }
`;
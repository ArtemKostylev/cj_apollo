import {gql} from "@apollo/client";

export const UPDATE_TEACHER_MUTATION = gql`
    mutation updateTeacherMutation($data: TeacherInput) {
        updateTeacher(data: $data) {
            id
            name
            surname
            parent
        }
    }
`;
import {gql} from "@apollo/client";

export const CREATE_TEACHER_MUTATION = gql`
    mutation createTeacherMutation($data: TeacherInput) {
        createTeacher(data: $data) {
            id
            name
            surname
            parent
        }
    }
`;
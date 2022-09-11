import {gql} from "@apollo/client";

export const CREATE_STUDENT_MUTATION = gql`
    mutation createStudentMutation($data: StudentInput) {
        createStudent(data: $data) {
            id
            name
            surname
            class
            program
        }
    }
`;
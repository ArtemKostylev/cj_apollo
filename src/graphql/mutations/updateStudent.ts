import {gql} from "@apollo/client";

export const UPDATE_STUDENT_MUTATION = gql`
    mutation updateStudentMutation($data: StudentInput) {
        updateStudent(data: $data) {
            id
            name
            surname
            class
            program
            specialization {
                id
            }
        }
    }
`;
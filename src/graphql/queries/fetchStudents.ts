import {gql} from "@apollo/client";

export const FETCH_STUDENTS_QUERY = gql`
    query fetchStudentsQuery {
        fetchStudents {
            id
            name
            surname
            class
            program
        }
    }
`;

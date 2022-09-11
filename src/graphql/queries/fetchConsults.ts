import {gql} from "@apollo/client";

export const FETCH_CONSULTS_QUERY = gql`
    query fetchConsultsQuery($teacherId: Int!, $courseId: Int!, $year: Int!) {
        fetchConsults(teacherId: $teacherId, courseId: $courseId, year: $year) {
            id
            student {
                id
                name
                surname
                class
                program
            }
            consult {
                id
                hours
                date
            }
        }
    }
`;
import {gql} from "@apollo/client";

export const FETCH_GROUP_CONSULTS_QUERY = gql`
    query fetchGroupConsultsQuery(
        $teacherId: Int!
        $courseId: Int!
        $year: Int!
    ) {
        fetchGroupConsults(
            teacherId: $teacherId
            courseId: $courseId
            year: $year
        ) {
            group
            consult {
                id
                date
                hours
            }
        }
    }
`;
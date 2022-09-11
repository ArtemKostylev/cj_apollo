import {gql} from "@apollo/client";

export const FETCH_SUBGROUPS_QUERY = gql`
    query fetchSubgroupsQuery($teacherId: Int!, $courseId: Int!) {
        fetchSubgroups(teacherId: $teacherId, courseId: $courseId) {
            class
            program
            relations {
                id
                student {
                    id
                    name
                    surname
                }
                subgroup
            }
        }
    }
`;
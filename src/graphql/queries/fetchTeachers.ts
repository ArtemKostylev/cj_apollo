import {gql} from "@apollo/client";

export const FETCH_TEACHERS_QUERY = gql`
    query fetchTeachersQuery {
        fetchTeachers {
            id
            name
            surname
            parent
            userId
            relations {
                course {
                    id
                    name
                    group
                    onlyHours
                }
            }
        }
    }
`;
import {gql} from "@apollo/client";

export const FETCH_COURSES_QUERY = gql`
    query fetchCoursesQuery {
        fetchCourses {
            id
            name
            group
            onlyHours
        }
    }
`;

import {gql} from "@apollo/client";

export const CREATE_COURSE_MUTATION = gql`
    mutation createCourseMutation($data: CourseInput) {
        createCourse(data: $data) {
            id
            name
            group
            excludeFromReport
        }
    }
`;
import {gql} from "@apollo/client";

export const UPDATE_COURSE_MUTATION = gql`
    mutation updateCourseMutation($data: CourseInput) {
        updateCourse(data: $data) {
            id
            name
            group
            excludeFromReport
            onlyHours
        }
    }
`;
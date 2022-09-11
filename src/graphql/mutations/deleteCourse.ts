import {gql} from "@apollo/client";

export const DELETE_COURSE_MUTATION = gql`
    mutation deleteCourseMutation($id: Int) {
        deleteCourse(id: $id)
    }
`;
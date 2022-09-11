import {gql} from "@apollo/client";

export const UPDATE_COURSE_RELATIONS_MUTATION = gql`
    mutation updateCourseRelationsMutation(
        $teacher: Int
        $courses: [CourseRelationInput]
    ) {
        updateCourseRelations(teacher: $teacher, courses: $courses)
    }
`;
import {gql} from "@apollo/client";

export const UPDATE_STUDENT_RELATIONS_MUTATION = gql`
    mutation updateStudentRelationsMutation(
        $teacher: Int
        $course: Int
        $students: [StudentRelationInput]
    ) {
        updateStudentRelations(
            teacher: $teacher
            course: $course
            students: $students
        )
    }
`;
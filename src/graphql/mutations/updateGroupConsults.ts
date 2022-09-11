import {gql} from "@apollo/client";

export const UPDATE_GROUP_CONSULTS_MUTATION = gql`
    mutation updateGroupConsultsMutation(
        $data: [GroupConsultInput]
        $teacher: Int
        $course: Int
    ) {
        updateGroupConsults(teacher: $teacher, course: $course, data: $data) {
            id
            date
        }
    }
`;
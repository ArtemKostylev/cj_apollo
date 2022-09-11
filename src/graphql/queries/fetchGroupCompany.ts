import {gql} from "@apollo/client";

export const FETCH_GROUP_COMPANY = gql`
    query fetchGroupCompany($teacherId: Int, $courseId: Int) {
        fetchGroupCompany(teacherId: $teacherId, courseId: $courseId) {
            group
            hours {
                id
                date
                hours
            }
        }
    }
`;
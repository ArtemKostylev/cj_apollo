import {gql} from "@apollo/client";

export const FETCH_NOTES_QUERY = gql`
    query fetchNotesQuery($teacherId: Int!, $courseId: Int!, $year: Int!) {
        fetchNotes(teacherId: $teacherId, courseId: $courseId, year: $year) {
            id
            text
        }
    }
`;
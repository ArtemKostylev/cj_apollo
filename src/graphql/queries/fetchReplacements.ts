import {gql} from "@apollo/client";

export const FETCH_REPLACEMENTS_QUERY = gql`
    query fetchReplacementsQuery(
        $teacherId: Int!
        $courseId: Int!
        $date_gte: Date!
        $date_lte: Date!
    ) {
        fetchReplacements(
            teacherId: $teacherId
            courseId: $courseId
            date_gte: $date_gte
            date_lte: $date_lte
        ) {
            id
            student {
                id
                name
                surname
                class
                program
            }
            subgroup
            journalEntry {
                id
                mark
                date
                replacement {
                    id
                    date
                }
            }
        }
    }
`;
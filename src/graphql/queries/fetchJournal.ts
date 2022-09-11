import {gql} from "@apollo/client";

export const FETCH_JOURNAL_QUERY = gql`
    query fetchJournalQuery(
        $courseId: Int!
        $teacherId: Int!
        $year: Int!
        $date_gte: Date
        $date_lte: Date
    ) {
        fetchJournal(
            courseId: $courseId
            teacherId: $teacherId
            year: $year
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
            }
            quaterMark {
                id
                mark
                period
            }
            archived
            hours
        }
    }
`;
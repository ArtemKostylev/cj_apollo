import {gql} from "@apollo/client";

export const FETCH_INDIVIDUAL_JOURNAL_QUERY = gql`
    query fetchIndividualJournalQuery(
        $course: Int!
        $year: Int!
        $dateGte: Date!
        $dateLte: Date!
    ) {
        fetchIndividualJournal(
            courseId: $courseId
            year: $year
            date_gte: $date_gte
            date_lte: $date_lte
        ) {
            id
            studentName
            studentClass
            marks {
                id
                date
                value
            }
            quarterMarks {
                id
                period
                value
            }
        }
    }
`;
import {gql} from "@apollo/client";

export const UPDATE_JOURNAL_MUTATION = gql`
    mutation updateJournalMutation($data: JournalUpdateInput) {
        updateJournal(data: $data)
    }
`;
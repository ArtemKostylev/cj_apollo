import {gql} from "@apollo/client";

export const UPDATE_NOTE_MUTATION = gql`
    mutation updateNoteMutation($data: NoteInput) {
        updateNote(data: $data) {
            id
            text
        }
    }
`;
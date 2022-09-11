import {gql} from "@apollo/client";

export const UPDATE_REPLACEMENTS_MUTATION = gql`
    mutation updateReplacementsMutation($data: [ReplacementInput]) {
        updateReplacements(data: $data) {
            id
            date
        }
    }
`;

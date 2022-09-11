import {gql} from "@apollo/client";

export const DELETE_CONSULTS_MUTATION = gql`
    mutation deleteConsultsMutation($ids: [Int!]!) {
        deleteConsults(ids: $ids)
    }
`;

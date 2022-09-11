import {gql} from "@apollo/client";

export const DELETE_GROUP_CONSULTS_MUTATION = gql`
    mutation deleteGroupConsultsMutation($ids: [Int!]!) {
        deleteGroupConsults(ids: $ids)
    }
`;
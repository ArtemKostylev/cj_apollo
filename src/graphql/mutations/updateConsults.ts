import {gql} from "@apollo/client";

export const UPDATE_CONSULTS_MUTATION = gql`
    mutation updateConsultsMutation($data: [ConsultInput]) {
        updateConsults(data: $data) {
            id
            date
        }
    }
`;
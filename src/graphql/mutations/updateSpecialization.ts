import {gql} from "@apollo/client";

export const UPDATE_SPECIALIZATION_MUTATION = gql`
    mutation updateSpecializationMutation($data: SpecializationInput) {
        updateSpecialization(data: $data)
    }
`;
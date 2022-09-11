import {gql} from "@apollo/client";

export const DELETE_SPECIALIZATION_MUTATION = gql`
    mutation deleteSpecializationMutation($id: Int) {
        deleteSpecialization(id: $id)
    }
`;
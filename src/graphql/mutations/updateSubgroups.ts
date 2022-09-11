import {gql} from "@apollo/client";

export const UPDATE_SUBGROUPS_MUTATION = gql`
    mutation updateSubgroupsMutation($data: [SubgroupInput]) {
        updateSubgroups(data: $data) {
            subgroup
        }
    }
`;
import {gql} from "@apollo/client";

export const FETCH_SPECIALIZATION = gql`
    query fetchSpecialization {
        fetchSpecialization {
            id
            name
        }
    }
`;
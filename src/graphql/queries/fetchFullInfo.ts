import {gql} from "@apollo/client";

export const FETCH_FULL_INFO = gql`
    query fetchFullInfo {
        fetchFullInfo {
            teachers {
                id
                name
                surname
                parent
            }
            courses {
                id
                name
                group
                excludeFromReport
                onlyHours
            }
            students {
                id
                name
                surname
                class
                program
                specialization {
                    id
                }
            }
            relations {
                teacher {
                    id
                }
                student {
                    id
                }
                course {
                    id
                }
                archived
            }
            specializations {
                id
                name
            }
        }
    }
`;
import {gql} from '@apollo/client';

export const SIGN_IN = gql`
    mutation signInMutation($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
            token
            user {
                role {
                    name
                }
                teacher {
                    id
                    relations {
                        course {
                            id
                            name
                            group
                            onlyHours
                        }
                    }
                    freezeVersion {
                        year
                    }
                }
            }
        }
    }
`;
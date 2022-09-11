import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
    mutation LoginMutation($login: String!, $password: String!) {
        signin(login: $login, password: $password) {
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
                }
            }
        }
    }
`;
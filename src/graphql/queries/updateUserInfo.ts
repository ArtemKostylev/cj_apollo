import {gql} from '@apollo/client';

export const UPDATE_USER_INFO = gql`
    query updateUserInfoQuery($token: String!) {
        updateUserInfo(token: $token) {
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
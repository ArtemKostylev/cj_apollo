import {gql} from '@apollo/client';

export const STUDENT_FRAGMENT = gql`
    fragment StudentFragment on Student {
        id
        name
        surname
        class
        program
    }
`;
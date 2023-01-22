import {gql} from '@apollo/client';

export const MIDTERM_EXAM_TYPE_FRAGMENT = gql`
    fragment MidtermExamTypeFragment on MidtermExamType {
        id
        name
    }
`;
import {gql} from '@apollo/client';

export const UPDATE_MIDTERM_EXAM = gql`
    mutation updateMidtermExam($data: MidtermExamInput) {
        updateMidtermExam(data: $data) {
            id
            student {
                id
                name
                surname
                class
                program
            }
            date
            contents
            result
            type {
                id
                name
            }
            number
        }
    }
`;
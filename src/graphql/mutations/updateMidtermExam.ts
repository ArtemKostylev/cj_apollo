import {gql} from '@apollo/client';

export const UPDATE_MIDTERM_EXAM = gql`
    mutation updateMidtermExam($data: MidtermExamInput) {
        updateMidtermExam(data: $data) {
            id
            mark
            date
            student {
                id
                name
                surname
                class
                program
            }
        }
    }
`;
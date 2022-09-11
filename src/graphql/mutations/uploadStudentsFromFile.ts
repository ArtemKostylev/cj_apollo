import {gql} from "@apollo/client";

export const UPLOAD_STUDENTS_FROM_FILE = gql`
    mutation uploadStudentsFromFileMutation($file: Upload!) {
        uploadStudentsFromFile(file: $file)
    }
`;

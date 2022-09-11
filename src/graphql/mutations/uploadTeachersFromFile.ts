import {gql} from "@apollo/client";

export const UPLOAD_TEACHERS_FROM_FILE = gql`
    mutation uploadTeachersFromFileMutation($file: Upload!) {
        uploadTeachersFromFile(file: $file)
    }
`;
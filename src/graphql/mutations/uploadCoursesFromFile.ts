import {gql} from "@apollo/client";

export const UPLOAD_COURSES_FROM_FILE = gql`
    mutation uploadCoursesFromFileMutation($file: Upload!) {
        uploadCoursesFromFile(file: $file)
    }
`;
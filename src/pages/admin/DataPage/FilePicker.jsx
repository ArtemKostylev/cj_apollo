import {useMutation} from '@apollo/client';
import React from 'react';
import {UPLOAD_TEACHERS_FROM_FILE} from "../../../graphql/mutations/uploadTeachersFromFile";
import {UPLOAD_STUDENTS_FROM_FILE} from "../../../graphql/mutations/uploadStudentsFromFile";
import {UPLOAD_COURSES_FROM_FILE} from "../../../graphql/mutations/uploadCoursesFromFile";
import '../../../styles/FilePicker.css';

export const FilePicker = ({type, close}) => {
    let title;
    let mutation;

    switch (type) {
        case 'teacher':
            title = 'преподавателей';
            mutation = UPLOAD_TEACHERS_FROM_FILE;
            break;
        case 'course':
            title = 'предметов';
            mutation = UPLOAD_COURSES_FROM_FILE;
            break;
        case 'student':
            title = 'учащихся';
            mutation = UPLOAD_STUDENTS_FROM_FILE;
            break;
        default:
            title = '';
            mutation = UPLOAD_TEACHERS_FROM_FILE;
    }

    const [send] = useMutation(mutation);

    const onChange = ({
                          target: {
                              validity,
                              files: [file],
                          },
                      }) => {
        send({variables: {file}});
    };

    return (
        <div className='filepicker_container'>
            <h1>Загрузка {title}</h1>
            <input type='file' required onChange={onChange}/>
            <button onClick={() => close()}>Закрыть</button>
        </div>
    );
};

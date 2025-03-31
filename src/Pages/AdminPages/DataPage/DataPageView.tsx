import React, { useState, useEffect, useMemo } from 'react';
import '../../../styles/DataPage.css';
import {
    BsChevronDown,
    BsChevronUp,
    BsPlusSquare,
    BsPencilSquare,
    BsTrash,
    BsCheck,
} from 'react-icons/bs';

import { IoMdListBox } from 'react-icons/io';

import ReactModal from 'react-modal';
import { computeUpdateList, createConditionalState } from './utils';
import { ModalContent } from './ModalContent';
import { FilePicker } from './components/FilePicker';
import { PROGRAMS } from '../../../constants/programs';
import { compareStudents } from '../../../utils/comparators';
import { TeacherCreateForm } from './components/createForms/TeacherCreateForm';
import { CourseCreateForm } from './components/createForms/CourseCreateForm';
import { StudentCreateForm } from './components/createForms/StudentCreateForm';
import { TeacherUpdateForm } from './components/updateForms/TeacherUpdateForm';
import { CourseUpdateForm } from './components/updateForms/CourseUpdateForm';
import { StudentUpdateForm } from './components/updateForms/StudentUpdateForm';
import { EntityFormProps } from './types';
import styled from 'styled-components';
import { DataPageWrapper } from './styles';
import { DataPageBlock } from './components/DataPageBlock';

enum FormModes {
    TEACHER_CREATE = 'TEACHER_CREATE',
    COURSE_CREATE = 'COURSE_CREATE',
    STUDENT_CREATE = 'STUDENT_CREATE',
    TEACHER_UPDATE = 'TEACHER_UPDATE',
    COURSE_UPDATE = 'COURSE_UPDATE',
    STUDENT_UPDATE = 'STUDENT_UPDATE'
}

const FORM_BY_MODE: Record<FormModes, React.ElementType<EntityFormProps>> = {
    [FormModes.TEACHER_CREATE]: TeacherCreateForm,
    [FormModes.COURSE_CREATE]: CourseCreateForm,
    [FormModes.STUDENT_CREATE]: StudentCreateForm,
    [FormModes.TEACHER_UPDATE]: TeacherUpdateForm,
    [FormModes.COURSE_UPDATE]: CourseUpdateForm,
    [FormModes.STUDENT_UPDATE]: StudentUpdateForm,
}

interface FormState {
    visible: boolean;
    mode: FormModes | undefined;
}

const DEFAULT_FORM_STATE: FormState = {
    visible: false,
    mode: undefined,
}



export default function DataPageView(props) {
    const [formState, setFormState] = useState(DEFAULT_FORM_STATE);

    const CurrentForm = useMemo(() => formState.mode ? FORM_BY_MODE[formState.mode] : null, [formState.mode]);

    //this state controls which item is active now
    const [currentTeacher, setCurrentTeacher] = useState(0);
    const [currentCourse, setCurrentCourse] = useState(0);

    //this state controls which items should be highlited
    const [activeCourses, setActiveCourses] = useState(new Set());
    const [activeStudents, setActiveStudents] = useState(new Set());

    const [archivedCourses, setArchivedCourses] = useState(new Set());
    const [archivedStudents, setArchivedStudents] = useState(new Set());

    const [modalType, setModalType] = useState('teacher');
    const [courseMode, setCourseMode] = useState(false);
    const [studentMode, setStudentMode] = useState(false);

    const [checkedCourses, setCheckedCourses] = useState([]);
    const [checkedStudents, setCheckedStudents] = useState([]);

    const [filePickerShown, setFilePickerShown] = useState(false);
    const [fileType, setFileType] = useState();

    const [showModal, setShowModal] = useState(false);

    return (
        <DataPageWrapper>
            <DataPageBlock>
                <div className='block_header'>
                    <h2 style={{ flex: '15' }}>Преподаватели</h2>
                    <IoMdListBox
                        style={{ marginRight: '10px', flex: '1' }}
                        onClick={() => {
                            setFilePickerShown(true);
                            setFileType('teacher');
                        }}
                    />
                    <BsPlusSquare
                        style={{ marginRight: '10px', flex: '1' }}
                        onClick={() => {
                            setShowModal(true);
                            setModalType('teacher');
                        }}
                    />
                </div>
                <div className='list_wrapper'>
                    <ul>
                        {teachers.map((item) => (
                            <ChangesItem
                                key={item.id}
                                type='teacher'
                                data={item}
                                active={item.empty}
                            />
                        ))}
                    </ul>
                </div>
            </DataPageBlock>
            <DataPageBlock>
                <div className='block_header'>
                    <h2 style={{ flex: '15' }}>Учебные предметы</h2>
                    <IoMdListBox
                        style={{ marginRight: '10px', flex: '1' }}
                        onClick={() => {
                            setFilePickerShown(true);
                            setFileType('course');
                        }}
                    />
                    <BsPlusSquare
                        style={{ marginRight: '10px', flex: '1' }}
                        onClick={() => {
                            setShowModal(true);
                            setModalType('course');
                        }}
                    />
                    {currentTeacher ? (
                        courseMode ? (
                            <BsCheck
                                style={{ marginRight: '10px', flex: '1' }}
                                onClick={() => {
                                    setCourseMode(false);
                                    if (
                                        JSON.stringify(checkedCourses) !==
                                        JSON.stringify(activeCourses)
                                    ) {
                                        updateCourseRelations(
                                            currentTeacher,
                                            computeUpdateList(
                                                Array.from(activeCourses),
                                                checkedCourses
                                            )
                                        );
                                    }
                                }}
                            />
                        ) : (
                            <BsPencilSquare
                                style={{ marginRight: '10px', flex: '1' }}
                                onClick={() => {
                                    setCheckedCourses(Array.from(activeCourses));
                                    setCourseMode(true);
                                }}
                            />
                        )
                    ) : (
                        ''
                    )}
                </div>
                <div className='list_wrapper'>
                    <ul>
                        {courses
                            .filter((item) => activeCourses.has(item.id))
                            .map((item) => (
                                <ChangesItem
                                    key={item.id}
                                    type='course'
                                    data={item}
                                    active={true}
                                    mode={courseMode}
                                />
                            ))}
                        {courses
                            .filter((item) => archivedCourses.has(item.id))
                            .map((item) => (
                                <ChangesItem
                                    key={item.id}
                                    type='course'
                                    data={item}
                                    archived={true}
                                    mode={courseMode}
                                />
                            ))}
                        {courses
                            .filter(
                                (item) =>
                                    !activeCourses.has(item.id) && !archivedCourses.has(item.id)
                            )
                            .map((item) => (
                                <ChangesItem
                                    key={item.id}
                                    type='course'
                                    data={item}
                                    mode={courseMode}
                                />
                            ))}
                    </ul>
                </div>
            </DataPageBlock>
            <DataPageBlock>
                <div className='block_header'>
                    <h2 style={{ flex: '15' }}>Учащиеся</h2>
                    <IoMdListBox
                        style={{ marginRight: '10px', flex: '1' }}
                        onClick={() => {
                            setFilePickerShown(true);
                            setFileType('student');
                        }}
                    />
                    <BsPlusSquare
                        style={{ marginRight: '10px', flex: '1' }}
                        onClick={() => {
                            setShowModal(true);
                            setModalType('student');
                        }}
                    />
                    {currentCourse ? (
                        studentMode ? (
                            <BsCheck
                                style={{ marginRight: '10px', flex: '1' }}
                                onClick={() => {
                                    setStudentMode(false);
                                    if (
                                        JSON.stringify(checkedStudents) !==
                                        JSON.stringify(activeStudents)
                                    ) {
                                        updateStudentRelations(
                                            currentTeacher,
                                            currentCourse,
                                            computeUpdateList(
                                                Array.from(activeStudents),
                                                checkedStudents
                                            )
                                        );
                                    }
                                }}
                            />
                        ) : (
                            <BsPencilSquare
                                style={{ marginRight: '10px', flex: '1' }}
                                onClick={() => {
                                    setCheckedStudents(Array.from(activeStudents) || []);
                                    setStudentMode(true);
                                }}
                            />
                        )
                    ) : (
                        ''
                    )}
                </div>
                <div className='list_wrapper'>
                    <ul>
                        {students.map((group) => (
                            <React.Fragment key={`${group.class} ${group.program}`}>
                                {group.students.filter((item) => activeStudents.has(item.id))
                                    .length > 0 ? (
                                    <p className='class_paragraph'>{`Класс: ${group.class
                                        } Программа: ${PROGRAMS[group.program]}`}</p>
                                ) : (
                                    ''
                                )}
                                {group.students
                                    .filter((item) => activeStudents.has(item.id))
                                    .map((item) => (
                                        <ChangesItem
                                            key={item.id}
                                            type='student'
                                            data={item}
                                            active={true}
                                            mode={studentMode}
                                        />
                                    ))}
                            </React.Fragment>
                        ))}

                        {students.map((group) => (
                            <React.Fragment key={`${group.class} ${group.program}`}>
                                {group.students.filter((item) => archivedStudents.has(item.id))
                                    .length > 0 ? (
                                    <p className='class_paragraph'>{`${group.class} ${PROGRAMS[group.program]
                                        }`}</p>
                                ) : (
                                    ''
                                )}
                                {group.students
                                    .filter((item) => archivedStudents.has(item.id))
                                    .map((item) => (
                                        <ChangesItem
                                            key={item.id}
                                            type='student'
                                            data={item}
                                            archived={true}
                                            mode={studentMode}
                                        />
                                    ))}
                            </React.Fragment>
                        ))}
                        {students.map((group) => (
                            <React.Fragment key={`${group.class} ${group.program}`}>
                                {group.students.filter(
                                    (item) =>
                                        !activeStudents.has(item.id) &&
                                        !archivedStudents.has(item.id)
                                ).length > 0 ? (
                                    <p className='class_paragraph'>{` ${group.class} ${PROGRAMS[group.program]
                                        }`}</p>
                                ) : (
                                    ''
                                )}
                                {group.students
                                    .filter(
                                        (item) =>
                                            !activeStudents.has(item.id) &&
                                            !archivedStudents.has(item.id)
                                    )
                                    .sort(compareStudents)
                                    .map((item) => (
                                        <ChangesItem
                                            key={item.id}
                                            type='student'
                                            data={item}
                                            mode={studentMode}
                                        />
                                    ))}
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            </DataPageBlock>
            <ReactModal isOpen={formState.visible} className='modal' overlayClassName='overlay'>
                <CurrentForm />
            </ReactModal>
            <ReactModal isOpen={filePickerShown} className='modalfile' overlayClassName='overlay'>
                <FilePicker type={fileType} close={setFilePickerShown} />
            </ReactModal>
        </DataPageWrapper>
    );
}

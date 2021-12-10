import React, { useState, useEffect } from 'react';
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
import { computeUpdateList, createCoditionalState } from './dataPageHeplers';
import { ModalContent } from './ModalContent';
import { FilePicker } from './FilePicker';
import { PROGRAMS } from '../../../constants/programs';
import { compareStundents } from '../../../utils/utils';

const PROGRAM_MAPPER = [
  { value: 'PP_5', text: '(5)ПП' },
  { value: 'PP_8', text: '(8)ПП' },
  { value: 'OP', text: 'ОП' },
];

const convertSpecToOptions = (spec) => [
  ...spec.map((it) => ({ value: it.id.toString(), text: it.name })),
  { value: '', text: 'Не указано' },
];

const createOptions = (items) =>
  items.map((it) => <option value={it.value}>{it.text}</option>);

export default function DataPageView({
  teachers,
  courses,
  students,
  relations,
  specializations,
  update,
  createTeacher,
  createCourse,
  createStudent,
  clear,
  refetch,
  updateCourseRelations,
  updateStudentRelations,
}) {
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

  const LABELS = {
    name: 'Имя',
    surname: 'Фамилия',
    parent: 'Отчество',
    group: 'Групповой',
    class: 'Класс',
    program: 'Программа',
    spec: 'Специальность',
    exclude: 'Убрать из ведомости',
  };

  //creates a list of higlited items based on current values and relations, passed from apollo.
  useEffect(() => {
    let relationsByTeacher = relations.filter(
      (element) => element.teacher === currentTeacher && !element.archived
    );
    setActiveCourses(new Set(relationsByTeacher?.map((el) => el.course)));
    if (currentCourse) {
      let relationsByCourse = currentCourse
        ? relationsByTeacher.filter(
            (element) => element.course === currentCourse
          )
        : undefined;
      setActiveStudents(
        relationsByCourse[0]?.student !== undefined
          ? new Set(relationsByCourse?.map((el) => el.student))
          : new Set()
      );
    }

    let archivedByTeacher = relations.filter(
      (element) => element.teacher === currentTeacher && element.archived
    );
    //archived course - course with archived, but not active.
    setArchivedCourses(
      new Set(
        archivedByTeacher
          ?.map((el) => el.course)
          .filter(
            (el) =>
              -1 === relationsByTeacher.findIndex((rel) => rel.course === el)
          )
      )
    );

    if (currentCourse) {
      let archivedByCourse = archivedByTeacher.filter(
        (element) => element.course === currentCourse
      );
      setArchivedStudents(
        archivedByCourse[0]?.student !== undefined
          ? new Set(archivedByCourse?.map((el) => el.student))
          : new Set()
      );
    }
  }, [relations, currentCourse, currentTeacher]);

  const ChangesItem = ({ type, mode, data, active, archived }) => {
    const [formState, setFormState] = useState(
      createCoditionalState(type, data)
    );
    const [editVisible, setEditVisible] = useState(false);
    const [checked, setChecked] = useState(active);

    const expand = () => {
      setEditVisible((val) => !val);
    };

    const onChecked = () => {
      if (type === 'course') {
        setCheckedCourses((prev) => {
          let id = prev.findIndex((el) => el === data.id);
          id > -1 ? prev.splice(id, 1) : prev.push(data.id);
          return prev;
        });
      } else if (type === 'student') {
        setCheckedStudents((prev) => {
          let id = prev.findIndex((el) => el === data.id);
          id > -1 ? prev.splice(id, 1) : prev.push(data.id);
          return prev;
        });
      }
      setChecked((prev) => !prev);
    };

    const getClicked = () => {
      if (type === 'teacher') {
        return data.id === currentTeacher;
      }
      if (type === 'course') {
        return data.id === currentCourse;
      }
    };

    return (
      <li className={`change_item ${getClicked() ? 'clicked' : ''}`}>
        <div className={`text_panel ${editVisible ? 'visible' : ''}`}>
          <span
            onClick={() => {
              if (type === 'teacher') {
                setCurrentTeacher(data.id);
                setCurrentCourse(0);
                setActiveStudents(new Set());
              } else if (type === 'course') {
                setCurrentCourse(data.id);
              }
            }}
            style={{ flex: 5, textAlign: 'left' }}
          >
            <p className={` ${active ? 'text_active' : 'text'}`}>
              {`${data.surname || ''} ${data.name || ''} ${data.parent || ''}${
                archived ? '(A)' : ''
              }`}
            </p>
          </span>

          {mode ? (
            <input
              type='checkbox'
              checked={checked}
              style={{ marginRight: '4%' }}
              onChange={() => onChecked()}
            />
          ) : (
            <span
              className={`arrow_icon_container ${editVisible ? 'visible' : ''}`}
              onClick={expand}
            >
              {editVisible ? <BsChevronUp /> : <BsChevronDown />}
            </span>
          )}
        </div>
        <div className={`edit_panel ${editVisible ? 'visible' : ''}`}>
          <div className='form_input_containter'>
            {Object.keys(formState).map((key) => (
              <div key={key} className='form_input'>
                <label
                  style={{ flex: '1', textAlign: 'left', paddingLeft: '5%' }}
                >
                  {LABELS[key]}
                </label>
                {key === 'program' || key === 'spec' ? (
                  <select
                    style={{ flex: '4', width: '100%', margin: '1rem 1rem' }}
                    onChange={(e) => {
                      setFormState((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }));
                    }}
                    value={formState[key]}
                  >
                    {createOptions(
                      key === 'program'
                        ? PROGRAM_MAPPER
                        : convertSpecToOptions(specializations)
                    )}
                  </select>
                ) : (
                  <input
                    style={{ flex: '4' }}
                    value={formState[key]}
                    type={
                      key === 'group' || key === 'exclude' ? 'checkbox' : 'text'
                    }
                    checked={
                      key === 'group' || key === 'exclude'
                        ? formState[key]
                        : false
                    }
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        [key]:
                          key === 'group' || key === 'exclude'
                            ? e.target.checked
                            : e.target.value,
                      }))
                    }
                    maxLength={key === 'class' ? 1 : undefined}
                  />
                )}
              </div>
            ))}
          </div>
          <div className='form_controls'>
            <div onClick={() => update(type, { id: data.id, ...formState })}>
              <p>Сохранить</p>
              <BsPencilSquare />
            </div>
            <div onClick={() => clear(type, data.id)}>
              <p>Удалить</p>
              <BsTrash />
            </div>
          </div>
        </div>
      </li>
    );
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <div className='page'>
      <div className={`changes_block left visible`}>
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
      </div>
      <div className={`changes_block center visible`}>
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
      </div>
      <div className={`changes_block right visible`}>
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
                  <p className='class_paragraph'>{`Класс: ${
                    group.class
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
                  <p className='class_paragraph'>{`${group.class} ${
                    PROGRAMS[group.program]
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
                  <p className='class_paragraph'>{` ${group.class} ${
                    PROGRAMS[group.program]
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
                  .sort(compareStundents)
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
      </div>
      <ReactModal
        isOpen={showModal}
        className='modal'
        overlayClassName='overlay'
      >
        <ModalContent
          type={modalType}
          close={setShowModal}
          createTeacher={createTeacher}
          createCourse={createCourse}
          createStudent={createStudent}
          refetch={refetch}
        />
      </ReactModal>
      <ReactModal
        isOpen={filePickerShown}
        className='modalfile'
        overlayClassName='overlay'
      >
        <FilePicker type={fileType} close={setFilePickerShown} />
      </ReactModal>
    </div>
  );
}

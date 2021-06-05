import React, { useRef, useState, useEffect, Children } from "react";
import { PROGRAMS } from "../scripts/constants";
import "../styles/Changes.css";
import {
  BsChevronDown,
  BsChevronUp,
  BsPlusSquare,
  BsPencilSquare,
  BsTrash,
  BsCheck,
} from "react-icons/bs";

import ReactModal from "react-modal";

export default function DataPageView({
  teachers,
  courses,
  students,
  relations,
  update,
  createTeacher,
  createCourse,
  createStudent,
  clear,
  refetch,
}) {
  //this state controls which item is active now
  const [currentTeacher, setCurrentTeacher] = useState(0);
  const [currentCourse, setCurrentCourse] = useState(0);

  //this state controls which items should be highlited
  const [activeCourses, setActiveCourses] = useState(new Set());
  const [activeStudents, setActiveStudents] = useState(new Set());

  const [modalType, setModalType] = useState("teacher");
  const [courseMode, setCourseMode] = useState(false);
  const [studentMode, setStudentMode] = useState(false);

  const labels = {
    name: "Имя",
    surname: "Фамилия",
    group: "Групповой",
    class: "Класс",
  };

  //creates a list of higlited items based on current values and relations, passed from apollo.
  useEffect(() => {
    let relationsByTeacher = relations.filter(
      (element) => element.teacher === currentTeacher && !element.archived
    );
    console.log(relationsByTeacher);
    setActiveCourses(new Set(relationsByTeacher?.map((el) => el.course)));
    if (currentCourse) {
      let relationsByCourse = currentCourse
        ? relationsByTeacher.filter(
            (element) => element.course === currentCourse
          )
        : undefined;
      setActiveStudents(new Set(relationsByCourse?.map((el) => el.student)));
    }
  }, [relations, currentCourse, currentTeacher]);

  const ChangesItem = ({ type, mode, data, active }) => {
    const [formState, setFormState] = useState(
      createCoditionalState(type, data)
    );
    const [editVisible, setEditVisible] = useState(false);
    const [checked, setChecked] = useState(active);

    const expand = () => {
      setEditVisible((val) => !val);
    };

    return (
      <li className="change_item">
        <div className={`text_panel ${editVisible ? "visible" : ""}`}>
          <span
            onClick={() => {
              if (type === "teacher") {
                setCurrentTeacher(data.id);
              } else if (type === "course") {
                setCurrentCourse(data.id);
              }
            }}
            style={{ flex: 5, textAlign: "left" }}
          >
            <p className={` ${active ? "text_active" : "text"}`}>{`${
              data.name
            } ${data.surname || ""}`}</p>{" "}
          </span>

          {mode ? (
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked((prev) => !prev)}
            />
          ) : (
            <span
              className={`arrow_icon_container ${editVisible ? "visible" : ""}`}
              onClick={expand}
            >
              {editVisible ? <BsChevronUp /> : <BsChevronDown />}
            </span>
          )}
        </div>
        <div className={`edit_panel ${editVisible ? "visible" : ""}`}>
          {Object.keys(formState).map((key) => (
            <>
              <label>{labels[key]}</label>
              <input
                value={formState[key]}
                type={key === "group" ? "checkbox" : "text"}
                checked={key === "group" ? formState[key] : false}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    [key]: key === "group" ? e.target.checked : e.target.value,
                  }))
                }
              />
            </>
          ))}
          <BsPencilSquare
            onClick={() => update(type, { id: data.id, ...formState })}
          />
          <BsTrash onClick={() => clear(type, data.id)} />
        </div>
      </li>
    );
  };

  const createCoditionalState = (type, data = {}) => {
    switch (type) {
      case "teacher":
        return {
          name: data.name || "",
          surname: data.surname || "",
        };
      case "course":
        return {
          name: data.name || "",
          group: data.group || false,
        };
      case "student":
        return {
          name: data.name || "",
          surname: data.surname || "",
          class: data.class || "", //TODO add programm dropdown later
        };
      default:
        return {};
    }
  };

  const ModalContent = ({ type, close }) => {
    const [values, setValues] = useState(createCoditionalState(type));

    const submit = async () => {
      if (type === "teacher") {
        await createTeacher({
          variables: {
            data: {
              name: values.name,
              surname: values.surname,
            },
          },
        });
      } else if (type === "course") {
        await createCourse({
          variables: {
            data: {
              name: values.name,
              group: values.group,
            },
          },
        });
      } else if (type === "student") {
        await createStudent({
          variables: {
            data: {
              name: values.name,
              surname: values.surname,
              class: values.class,
              program: "OP",
            },
          },
        });
      }
      refetch();
    };

    let innerContent;

    if (type === "teacher") {
      innerContent = (
        <>
          <label>Имя</label>
          <input
            type="text"
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
            value={values.name}
          />
          <label>Фамилия</label>
          <input
            type="text"
            onChange={(e) =>
              setValues((prev) => ({ ...prev, surname: e.target.value }))
            }
            value={values.surname}
          />
        </>
      );
    } else if (type === "course") {
      innerContent = (
        <>
          <label>Название</label>
          <input
            type="text"
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
            value={values.name}
          />
          <label>Групповой</label>
          <input
            type="checkbox"
            onChange={(e) =>
              setValues((prev) => ({ ...prev, group: e.target.checked }))
            }
            checked={values.group}
          />
        </>
      );
    } else if (type === "student") {
      innerContent = (
        <>
          <label>Имя</label>
          <input
            type="text"
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
            value={values.name}
          />
          <label>Фамилия</label>
          <input
            type="text"
            onChange={(e) =>
              setValues((prev) => ({ ...prev, surname: e.target.value }))
            }
            value={values.surname}
          />
          <label>Класс</label>
          <input
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                class: parseInt(e.target.value),
              }))
            }
            maxLength="1"
            value={values.class}
          />
        </>
      );
    }

    return (
      <div>
        <h1>Header</h1>
        {innerContent}
        <button onClick={submit}>Submit</button>
        <button onClick={() => close(false)}>Cancel</button>
      </div>
    );
  };

  const [showModal, setShowModal] = useState(false);

  const updateCourseRelations = () => {};

  const coursesRef = React.useRef();

  return (
    <div className="page">
      <div className={`changes_block left visible`}>
        <div className="block_header">
          <h2 style={{ flex: "15" }}>Учителя</h2>
          <BsPlusSquare
            style={{ "margin-right": "10px", flex: "1" }}
            onClick={() => {
              setShowModal(true);
              setModalType("teacher");
            }}
          />
        </div>
        <ul>
          {teachers.map((item) => (
            <ChangesItem type="teacher" data={item} />
          ))}
        </ul>
      </div>
      <div className={`changes_block center visible`}>
        <div className="block_header">
          <h2 style={{ flex: "15" }}>Учителя</h2>
          <BsPlusSquare
            style={{ "margin-right": "10px", flex: "1" }}
            onClick={() => {
              setShowModal(true);
              setModalType("course");
            }}
          />
          {currentTeacher ? (
            courseMode ? (
              <BsCheck onClick={() => setCourseMode(false)} />
            ) : (
              <BsPencilSquare
                style={{ "margin-right": "10px", flex: "1" }}
                onClick={() => setCourseMode(true)}
              />
            )
          ) : (
            ""
          )}
        </div>
        <ul ref={coursesRef}>
          {courses
            .filter((item) => activeCourses.has(item.id))
            .map((item) => (
              <ChangesItem
                type="course"
                data={item}
                active={true}
                mode={courseMode}
              />
            ))}
          {courses
            .filter((item) => !activeCourses.has(item.id))
            .map((item) => (
              <ChangesItem type="course" data={item} mode={courseMode} />
            ))}
        </ul>
      </div>
      <div className={`changes_block right visible`}>
        <div className="block_header">
          <h2 style={{ flex: "15" }}>Учителя</h2>
          <BsPlusSquare
            style={{ "margin-right": "10px", flex: "1" }}
            onClick={() => {
              setShowModal(true);
              setModalType("student");
            }}
          />
          <BsPencilSquare
            style={{ "margin-right": "10px", flex: "1" }}
            onClick={() => setStudentMode((prev) => !prev)}
          />
        </div>
        <ul>
          {students
            .filter((item) => activeStudents.has(item.id))
            .map((item) => (
              <ChangesItem
                type="student"
                data={item}
                active={true}
                mode={studentMode}
              />
            ))}
          {students
            .filter((item) => !activeStudents.has(item.id))
            .map((item) => (
              <ChangesItem type="student" data={item} mode={studentMode} />
            ))}
        </ul>
        <ReactModal isOpen={showModal}>
          <ModalContent type={modalType} close={setShowModal} />
        </ReactModal>
      </div>
    </div>
  );
}

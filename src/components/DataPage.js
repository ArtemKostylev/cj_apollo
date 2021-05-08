import { NetworkStatus, useQuery } from "@apollo/client";
import React, { useRef, useState } from "react";
import { PROGRAMS } from "../scripts/constants";
import {
  FETCH_COURSES_QUERY,
  FETCH_STUDENTS_QUERY,
  FETCH_TEACHERS_QUERY,
} from "../scripts/queries";
import Controls from "./Controls";
import "../styles/Changes.css";

import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useOnClickOutside } from "../scripts/utils";

export default function Changes(props) {
  const dataTypes = ["Учителя", "Ученики", "Предметы"];
  const queryTypes = [
    FETCH_TEACHERS_QUERY,
    FETCH_STUDENTS_QUERY,
    FETCH_COURSES_QUERY,
  ];
  const indexTypes = ["fetchTeachers", "fetchStudents", "fetchCourses"];

  const mutationTypes = [];

  const [type, setType] = useState(0);

  const [blocksVisible, setBlocksVisible] = useState({
    teachers: true,
    courses: true,
    students: true,
  })

  const openNextBlock = (nextBlock, currentEl) => {
    setBlocksVisible(prev => ({ ...prev, [nextBlock]: true }))
  }

  const getType = (e) => {
    setType(parseInt(e.target.getAttribute("data-index")));
    refetch();
  };

  const add = (e) => {
    return null;
  };


  const remove = (e) => {
    return null;
  }

  var { loading, data, error, refetch, networkStatus } = useQuery(
    queryTypes[type],
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );
  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;

  const TeacherItem = (props) => {

    const expand = (e) => {
      setEditVisible(val => !val);
    }

    const outsideHandler = (e) => {
      if (editVisible) setEditVisible(false)
    }

    const ref = useRef();

    //useOnClickOutside(ref, outsideHandler)

    const [editVisible, setEditVisible] = useState(false);

    return (
      <li className="change_item teacher" ref={ref}>
        <div className={`text_panel ${editVisible ? "visible" : ""}`} >
          <p>{`${props.data.name} ${props.data.surname}`}</p>
          <span className={`arrow_icon_container ${editVisible ? "visible" : ""}`} onClick={expand}>
            {editVisible ? <BsChevronUp /> : <BsChevronDown />}
          </span>
        </div>
        <div className={`edit_panel ${editVisible ? "visible" : ""}`}>
          <input value={props.data.name} />
          <input value={props.data.surname} />
          {/* save */}
        </div>
      </li>
    );
  };

  const StudentItem = (props) => {
    return (
      <li className="change_item student">
        <p>
          {`${props.data.name} ${props.data.surname}${props.data.class} ${PROGRAMS[props.data.program]
            }`}
        </p>

      </li>
    );
  };

  const CourseItem = (props) => {
    return (
      <li className="change_item course">
        <p>{`${props.data.name} Групповой: ${props.data.group ? "да" : "нет"
          }`}</p>
      </li>
    );
  };

  return (
    <div className="page">
      <div className="changes_block left visible">
        <div className="list_wrapper">
          <ul>
            {data[indexTypes[type]].map((item) => {
              switch (type) {
                case 0:
                  return <TeacherItem data={item} />;
                case 1:
                  return <StudentItem data={item} />;
                case 2:
                  return <CourseItem data={item} />;
                default:
                  return spinner;
              }
            })}
          </ul>
        </div>
      </div>
      <div className={`changes_block center ${blocksVisible.courses ? "visible" : ""}`}>
        <div className="list_wrapper">
          <ul>
            {data[indexTypes[type]].map((item) => {
              switch (type) {
                case 0:
                  return <TeacherItem data={item} />;
                case 1:
                  return <StudentItem data={item} />;
                case 2:
                  return <CourseItem data={item} />;
                default:
                  return spinner;
              }
            })}
          </ul>
        </div>
      </div>
      <div className={`changes_block right ${blocksVisible.students ? "visible" : ""}`}>
        <div className="list_wrapper">
          <ul>
            {data[indexTypes[type]].map((item) => {
              switch (type) {
                case 0:
                  return <TeacherItem data={item} />;
                case 1:
                  return <StudentItem data={item} />;
                case 2:
                  return <CourseItem data={item} />;
                default:
                  return spinner;
              }
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

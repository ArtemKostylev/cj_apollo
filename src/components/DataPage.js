import { NetworkStatus, useQuery } from "@apollo/client";
import React, { useRef, useState, useEffect } from "react";
import { PROGRAMS } from "../scripts/constants";
import {
  FETCH_FULL_INFO,
} from "../scripts/queries";
import Controls from "./Controls";
import "../styles/Changes.css";

import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useOnClickOutside } from "../scripts/utils";

export default function Changes(props) {

  const [currentTeacher, setCurrentTeacher] = useState();
  const [currentCourse, setCurrentCourse] = useState();
  const [courses, setCourses] = useState();
  const [studets, setStudents] = useState();

  var { loading, data, error, refetch, networkStatus } = useQuery(
    FETCH_FULL_INFO,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;

  const fullData = data.fetchFullInfo
  const relations = fullData?.relations?.map(el => ({
    teacher: el.teacher.id,
    course: el.course.id,
    student: el.course.id,
  }))

  const buildRealation = () => {
    let relationsByTeacher = undefined, relationsByCourse = undefined;
    if (!currentCourse) {
      relationsByTeacher = relations.find(element => element.teacher === currentTeacher);
      setCourses(new Set(relationsByTeacher.map(el => el.course)))
    } else {
      relationsByCourse = currentCourse ? relationsByTeacher.find(element => element.course === currentCourse) : undefined;
      setStudents(new Set(relationsByCourse?.map(el => el.student)))
    }

  }

  useEffect(buildRealation(), [buildRealation]);

  const TeacherItem = (props) => {

    const expand = () => {
      setEditVisible(val => !val)
    }

    const [editVisible, setEditVisible] = useState(false);

    console.log(props.data)
    return (
      <li className="change_item teacher">
        <div className={`text_panel ${editVisible ? "visible" : ""}`} >
          <p>{`${props.data.name} ${props.data.surname}`}</p>
          <span className={`arrow_icon_container ${editVisible ? "visible" : ""}`} onClick={expand} >
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

    const expand = () => {
      setEditVisible(val => !val)
    }

    const [editVisible, setEditVisible] = useState(false);

    return (
      <li className="change_item student">
        <div className={`text_panel ${editVisible ? "visible" : ""}`} >
          <p>{`${props.data.name} ${props.data.surname}`}</p>
          <span className={`arrow_icon_container ${editVisible ? "visible" : ""}`} onClick={expand} >
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

  const CourseItem = (props) => {
    const expand = () => {
      setEditVisible(val => !val)
    }

    const [editVisible, setEditVisible] = useState(false);

    return (
      <li className="change_item course">
        <div className={`text_panel ${editVisible ? "visible" : ""}`} >
          <p>{`${props.data.name} `}</p>
          <span className={`arrow_icon_container ${editVisible ? "visible" : ""}`} onClick={expand} >
            {editVisible ? <BsChevronUp /> : <BsChevronDown />}
          </span>
        </div>
        <div className={`edit_panel ${editVisible ? "visible" : ""}`}>
          <input value={props.data.name} />
          <div>
            <input type="radio" checked={props.data.group} />
            <label>групповой</label>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="page">
      <div className="changes_block left visible">
        <div className="block_header">Учителя</div>
        <div className="list_wrapper">
          <ul>
            {fullData.teachers.map((item) =>
              <TeacherItem data={item} />
            )}
          </ul>
        </div>
      </div>
      <div className={`changes_block center visible`}>
        <div className="block_header">Предметы</div>
        <div className="list_wrapper">
          <ul>{fullData.courses.map((item) =>
            <CourseItem data={item} />
          )}</ul>
        </div>
      </div>
      <div className={`changes_block right visible`}>
        <div className="block_header">Ученики</div>
        <div className="list_wrapper">
          <ul>{fullData.students.map((item) =>
            <StudentItem data={item} />
          )}</ul>
        </div>
      </div>
    </div>
  );
}

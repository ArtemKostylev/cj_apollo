
import React, { useRef, useState, useEffect } from "react";
import { PROGRAMS } from "../scripts/constants";
import "../styles/Changes.css";
import { BsChevronDown, BsChevronUp, BsPlusSquare, BsPencilSquare } from "react-icons/bs";

export default function DataPageView({teachers, courses, students, relations}) {

  //this state controls which item is active now
  const [currentTeacher, setCurrentTeacher] = useState(0);
  const [currentCourse, setCurrentCourse] = useState(0);

  //this state controls which items should be highlited 
  const [activeCourses, setActiveCourses] = useState(new Set());
  const [activeStudents, setActiveStudents] = useState(new Set());


  //creates a list of higlited items based on current values and relations, passed from apollo.
  useEffect(() => {
    let relationsByTeacher = relations.filter(element => element.teacher === currentTeacher);
    setActiveCourses(new Set(relationsByTeacher?.map(el => el.course)))
    if (currentCourse) {
      let relationsByCourse = currentCourse ? relationsByTeacher.filter(element => element.course === currentCourse) : undefined;
      setActiveStudents(new Set(relationsByCourse?.map(el => el.student)))
    }
  }, [relations, currentCourse, currentTeacher]);


  //teachers menu item ui
  const TeacherItem = ({data, onTextClick}) => {

    const expand = () => {
      setEditVisible(val => !val)
    }

    const [editVisible, setEditVisible] = useState(false);

    return (
      <li className="change_item teacher" >
        <div className={`text_panel ${editVisible ? "visible" : ""}`} >
          <span onClick={() => onTextClick(data.id)} style={{flex: 5, textAlign:"left"}}>
            <p>{`${data.name} ${data.surname}`}</p>
          </span>
         
          <span className={`arrow_icon_container ${editVisible ? "visible" : ""}`} onClick={expand} >
            {editVisible ? <BsChevronUp /> : <BsChevronDown />}
          </span>
        </div>
        <div className={`edit_panel ${editVisible ? "visible" : ""}`}>
          <input value={data.name} />
          <input value={data.surname} />
          {/* save */}
        </div>
      </li>
    );
  };


  //students menu item ui
  const StudentItem = ({data, active}) => {

    const expand = () => {
      setEditVisible(val => !val)
    }

    const [editVisible, setEditVisible] = useState(false);

    return (
      <li className="change_item student">
        <div className={`text_panel ${editVisible ? "visible" : ""}`} >
          <p className={`${active?"text_active":"text"}`}>{`${data.name} ${data.surname}`}</p>
          <span className={`arrow_icon_container ${editVisible ? "visible" : ""}`} onClick={expand} >
            {editVisible ? <BsChevronUp /> : <BsChevronDown />}
          </span>
        </div>
        <div className={`edit_panel ${editVisible ? "visible" : ""}`}>
          <input value={data.name} />
          <input value={data.surname} />
          {/* save */}
        </div>

      </li>
    );
  };


  //courses menu item ui
  const CourseItem = ({data, active, onTextClick}) => {
    const expand = () => {
      setEditVisible(val => !val)
    }

    const [editVisible, setEditVisible] = useState(false);

    return (
      <li className="change_item course" onClick={() => onTextClick(data.id)}>
        <div className={`text_panel ${editVisible ? "visible" : ""}`} >
          <p className={`${active?"text_active":"text"}`}>{`${data.name} `}</p>
          <span className={`arrow_icon_container ${editVisible ? "visible" : ""}`} onClick={expand} >
            {editVisible ? <BsChevronUp /> : <BsChevronDown />}
          </span>
        </div>
        <div className={`edit_panel ${editVisible ? "visible" : ""}`}>
          <input value={data.name} />
          <div>
            <input type="radio" checked={data.group} />
            <label>групповой</label>
          </div>
        </div>
      </li>
    );
  };

  const ChangesBlock = ({position, children}) => {
    return (
      <div className="changes_block left visible">
        <div className="block_header">
          <h2 style={{"flex":"15"}}>Учителя</h2>
          <BsPlusSquare style={{"margin-right": "10px", "flex":"1"}}/>
          <BsPencilSquare style={{"margin-right": "10px", "flex":"1"}}/>
        </div>
        <div className="list_wrapper">
          {children}
        </div>
      </div>
    )
  }

  //TODO split in 2 parts

  return (
    <div className="page">
      <ChangesBlock>
      <ul>
            {teachers.map((item) =>
              <TeacherItem data={item} onTextClick={index => {setCurrentTeacher(index)}}/>
            )}
          </ul>
      </ChangesBlock>
          
      <div className={`changes_block center visible`}>
      <div className="block_header">
          <h2 style={{"flex":"15"}}>Предметы</h2>
          <BsPlusSquare style={{"margin-right": "10px", "flex":"1"}}/>
          <BsPencilSquare style={{"margin-right": "10px", "flex":"1"}}/>
        </div>
        <div className="list_wrapper">
          <ul>{courses.map((item) =>
            <CourseItem data={item} active={activeCourses?.has(item.id)} onTextClick={index => {setCurrentCourse(index)}}/>
          )}</ul>
        </div>
      </div>
      <div className={`changes_block right visible`}>
      <div className="block_header">
          <h2 style={{"flex":"15"}}>Ученики</h2>
          <BsPlusSquare style={{"margin-right": "10px", "flex":"1"}}/>
          <BsPencilSquare style={{"margin-right": "10px", "flex":"1"}}/>
        </div>
        <div className="list_wrapper">
          <ul>{students.map((item) =>
            <StudentItem data={item} active={activeStudents?.has(item.id)}/>
          )}</ul>
        </div>
      </div>
    </div>
  );
}

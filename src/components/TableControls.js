import React from "react";
import { GROUP_PERIODS, MONTHS } from "../scripts/constants";
import { useOnClickOutside } from "../scripts/utils";

export const TableControls = ({
  initialMonth,
  setMonth,
  save,
  courses,
  course,
  setCourse,
  period,
  setPeriod,
}) => {
  const [monthPickerValue, setMonthPickerValue] = React.useState(
    period ? period : MONTHS[initialMonth]
  );
  const [coursePickerValue, setCoursePickerValue] = React.useState(course);
  const [monthDropdownVisible, setMonthDropdownVisibility] = React.useState(
    false
  );
  const [courseDropdownVisible, setCourseDropdownVisibility] = React.useState(
    false
  );

  const onMonthClick = (e) => {
    console.log();
    period
      ? setMonthPickerValue(GROUP_PERIODS[e.target.getAttribute("data-id")])
      : setMonthPickerValue(e.target.innerHTML);
    setMonthDropdownVisibility(false);
  };

  const onCourseClick = (e) => {
    setCoursePickerValue(e.target.getAttribute("data-index"));
    setCourseDropdownVisibility(false);
  };

  const openMonth = () => {
    if (!monthDropdownVisible) setMonthDropdownVisibility(true);
    else setMonthDropdownVisibility(false);
  };

  const openCourse = () => {
    if (!monthDropdownVisible) setCourseDropdownVisibility(true);
    else setCourseDropdownVisibility(false);
  };

  React.useEffect(() => {
    period
      ? setPeriod(monthPickerValue)
      : setMonth(MONTHS.indexOf(monthPickerValue));
  }, [monthPickerValue, setMonth, setPeriod, period]);

  React.useEffect(() => {
    console.log(coursePickerValue);
    setCourse(coursePickerValue);
  }, [coursePickerValue, setCourse]);

  const ref = React.useRef();
  const ref2 = React.useRef();

  useOnClickOutside(ref, () => {
    setMonthDropdownVisibility(false);
  });

  useOnClickOutside(ref2, () => {
    setCourseDropdownVisibility(false);
  });

  const PeriodPicker = () => (
    <div
      className={`month_picker ${monthDropdownVisible ? "visible" : ""}`}
      onClick={openMonth}
      ref={ref}
    >
      {monthPickerValue.name}
      <div
        className={`month_dropdown ${monthDropdownVisible ? "visible" : ""}`}
      >
        <ul>
          <li onClick={onMonthClick} data-id={"first_half"}>
            Первое полугодие
          </li>
          <li onClick={onMonthClick} data-id={"second_half"}>
            Второе полугодие
          </li>
        </ul>
      </div>
    </div>
  );

  const MonthPicker = () => {
    return (
      <div
        className={`month_picker ${monthDropdownVisible ? "visible" : ""}`}
        onClick={openMonth}
        ref={ref}
      >
        {monthPickerValue}
        <div
          className={`month_dropdown ${monthDropdownVisible ? "visible" : ""}`}
        >
          <ul>
            {MONTHS.map((month, index) => (
              ![5, 6, 7].includes(index) ? <li onClick={onMonthClick}>{month}</li> : ""
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="controls_wrapper">
      {period ? <PeriodPicker /> : <MonthPicker />}
      <div
        className={`month_picker ${courseDropdownVisible ? "visible" : ""}`}
        onClick={openCourse}
        ref={ref2}
      >
        {courses[coursePickerValue].name}
        <div
          className={`month_dropdown ${courseDropdownVisible ? "visible" : ""}`}
        >
          <ul>
            {courses.map((course, index) => (
              <li onClick={onCourseClick} data-index={index}>
                {course.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="save_button" onClick={save}>
        Сохранить
      </div>
    </div>
  );
};

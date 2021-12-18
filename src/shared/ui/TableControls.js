import React, { useState, useRef } from 'react';
import { GROUP_PERIODS } from '../../constants/periods';
import { MONTHS } from '../../constants/months';
import { useOnClickOutside } from '../../utils/utils';

const TableControls = ({
  initialMonth,
  setMonth,
  save,
  courses,
  course,
  setCourse,
  period,
  setPeriod,
  refetch,
}) => {
  const [monthPickerValue, setMonthPickerValue] = React.useState(
    period || MONTHS[initialMonth]
  );
  const [coursePickerValue, setCoursePickerValue] = React.useState(course);

  const onMonthClick = (e, setOpened) => {
    period
      ? setMonthPickerValue(GROUP_PERIODS[e.target.getAttribute('data-id')])
      : setMonthPickerValue(e.target.innerHTML);
    setOpened(false);
  };

  const onCourseClick = (e, setOpened) => {
    setCoursePickerValue(e.target.getAttribute('data-index'));
    setOpened(false);
  };

  React.useEffect(() => {
    period
      ? setPeriod(monthPickerValue)
      : setMonth(MONTHS.indexOf(monthPickerValue));
  }, [monthPickerValue, setMonth, setPeriod, period]);

  React.useEffect(() => {
    setCourse(coursePickerValue);
  }, [coursePickerValue, setCourse]);

  const ValuePicker = ({ name, type, onItemClick }) => {
    const [opened, setOpened] = useState(false);
    const ref = useRef();

    const open = () => {
      if (!opened) setOpened(true);
      else setOpened(false);
    };

    useOnClickOutside(ref, () => {
      setOpened(false);
    });

    return (
      <div
        className={`month_picker ${opened ? 'visible' : ''}`}
        onClick={open}
        ref={ref}
      >
        {name}
        <div className={`month_dropdown ${opened ? 'visible' : ''}`}>
          {type === 'period' ? (
            <ul>
              <li
                onClick={(e) => onItemClick(e, setOpened)}
                data-id={'first_half'}
              >
                Первое полугодие
              </li>
              <li
                onClick={(e) => onItemClick(e, setOpened)}
                data-id={'second_half'}
              >
                Второе полугодие
              </li>
            </ul>
          ) : type === 'month' ? (
            <ul>
              {[8, 9, 10, 11, 0, 1, 2, 3, 4].map((month, index) => (
                <li key={month} onClick={(e) => onItemClick(e, setOpened)}>
                  {MONTHS[month]}
                </li>
              ))}
            </ul>
          ) : type === 'course' ? (
            <ul>
              {courses.map((course, index) => (
                <li
                  key={course.name}
                  onClick={(e) => onItemClick(e, setOpened)}
                  data-index={index}
                >
                  {course.name}
                </li>
              ))}
            </ul>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='controls_wrapper noselect'>
      <ValuePicker
        name={period ? monthPickerValue.name : monthPickerValue}
        type={period ? 'period' : 'month'}
        onItemClick={onMonthClick}
      />
      <ValuePicker
        name={courses[coursePickerValue].name}
        type='course'
        onItemClick={onCourseClick}
      />
      <div className='save_button' onClick={save}>
        Сохранить
      </div>
      <div className='save_button' onClick={refetch}>
        Отменить изменения
      </div>
    </div>
  );
};

export default TableControls;

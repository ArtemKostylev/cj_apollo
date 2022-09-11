import React, {useState, useRef, useCallback, memo} from 'react';
import {GROUP_PERIODS} from '../../constants/periods';
import {MONTHS} from '../../constants/months';
import {useOnClickOutside} from '../../hooks/useOnClickOutside';
import {ActionButton} from './ActionButton';

const MONTH = 'month';
const PERIOD = 'period';
const COURSE = 'course';
const YEAR = 'year';

export const YEARS = {
    2021: '2021/2022',
    2022: '2022/2023'
}

const ValuePicker = memo(({name, type, onItemClick, courses}) => {
    const [opened, setOpened] = useState(false);
    const ref = useRef();

    const open = useCallback(() => {
        setOpened(prev => !prev)
    }, []);

    const onClick = (e) => {
        onItemClick(e);
        setOpened(false);
    }

    useOnClickOutside(ref, () => {
        setOpened(false);
    });

    const PeriodList = () => (
        <ul>
            <li onClick={onClick} data-id={'first_half'}>
                Первое полугодие
            </li>
            <li onClick={onClick} data-id={'second_half'}>
                Второе полугодие
            </li>
        </ul>
    )

    const MonthList = () => (
        <ul>
            {[8, 9, 10, 11, 0, 1, 2, 3, 4].map((month) => (
                <li key={month} onClick={onClick}>
                    {MONTHS[month]}
                </li>
            ))}
        </ul>
    )

    const CourseList = () => (
        <ul>
            {courses && courses.map((course, index) => (
                <li key={course.name} onClick={onClick} data-index={index}>
                    {course.name}
                </li>
            ))}
        </ul>
    )

    const YearList = () => (
        <ul>
            {Object.entries(YEARS).map(([key, value]) => (
                <li key={key} onClick={onClick} data-index={key}>{value}</li>
            ))}
        </ul>
    )

    const listMap = {
        [MONTH]: <MonthList/>,
        [COURSE]: <CourseList/>,
        [PERIOD]: <PeriodList/>,
        [YEAR]: <YearList/>
    }

    return (
        <div className={`month_picker ${opened ? 'visible' : ''}`} ref={ref}>
            <div onClick={open}>{name}</div>
            {opened && <div className={`month_dropdown ${opened ? 'visible' : ''}`}>
                {listMap[type]}
            </div>}
        </div>
    );
});

const TableControls = ({
                           initialMonth,
                           setMonth,
                           save,
                           courses,
                           course,
                           setCourse,
                           period = undefined,
                           setPeriod = undefined,
                           setYear,
                           year,
                       }) => {
    const onMonthClick = useCallback((e) => {
        period
            ? setPeriod(GROUP_PERIODS[e.target.getAttribute('data-id')])
            : setMonth(MONTHS.indexOf(e.target.innerHTML));
    }, []);

    const onCourseClick = useCallback((e) => {
        setCourse(e.target.getAttribute('data-index'));
    }, []);

    const onYearClick = useCallback((e) => {
        setYear(e.target.getAttribute('data-index'))
    }, [])

    return (
        <div className='controls_wrapper noselect'>
            <ValuePicker
                name={period?.name || MONTHS[initialMonth]}
                type={period ? PERIOD : MONTH}
                onItemClick={onMonthClick}
            />
            <ValuePicker
                name={courses[course].name}
                type='course'
                onItemClick={onCourseClick}
                courses={courses}
            />
            <ValuePicker
                name={YEARS[year]}
                type={YEAR}
                onItemClick={onYearClick}
            />
            <ActionButton onClick={save}>Сохранить</ActionButton>
        </div>
    );
};

export default TableControls;

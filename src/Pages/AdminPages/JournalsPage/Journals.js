import React, {useState} from 'react';
import {useQuery} from '@apollo/client';
import {FETCH_JOURNAL_QUERY} from "../../../graphql/queries/fetchJournal";
import {FETCH_TEACHERS_QUERY} from "../../../graphql/queries/fetchTeachers";
import '../../../styles/Journals.css';
import moment from 'moment';
import {QUARTERS, QUARTERS_RU} from '../../../constants/quarters';
import {ACADEMIC_YEARS} from '../../../constants/academicYears';
import {PERIODS} from '../../../constants/periods';
import {getQuarter} from '../../../utils/date';
import {useHistory} from 'react-router-dom';

export const Journals = () => {
    let history = useHistory();

    const [teacherIndex, setTeacherIndex] = useState();
    const [period, setPeriod] = useState(getQuarter(moment().month()));
    const [year, setYear] = useState(
        moment().month() > 7 ? moment().year() : moment().year() - 1
    );
    const [course, setCourse] = useState(0);

    const spinner = <div>Загрузка</div>;

    const {
        loading: tcLoading,
        data: teachers,
        error,
    } = useQuery(FETCH_TEACHERS_QUERY);

    if (tcLoading) return spinner;
    if (error) throw new Error(503);

    const ListItem = (props) => {
        return (
            <li
                tabIndex='0'
                onClick={() => setTeacherIndex(props.index)}
                className={teacherIndex === props.index ? 'active' : ''}
            >
                <p>{props.name}</p>
            </li>
        );
    };

    const extrudeDate = (date) => {
        const [month, day] = date.split('T')[0].split('-').slice(1);
        return `${day}.${month}`;
    };

    const StudentItem = (props) => {
        const cells = Array(props.cells)
            .fill()
            .map((x, i) => i);
        return (
            <div className='teacher_item'>
                <div className='item_header'>
                    <p>{props.name}</p>
                    <p>{props.archived ? '(A)' : ''}</p>
                    <p>{`Выдано уроков: ${props.hours}`}</p>
                </div>
                <div className='item_data'>
                    <table>
                        <thead>
                        <tr>
                            {cells.map((cell) => (
                                <th key={cell}>
                                    {props.dates[cell] ? extrudeDate(props.dates[cell]) : '...'}
                                </th>
                            ))}
                            <th
                                style={{width: '10%', whiteSpace: 'nowrap', margin: '10px'}}
                            >
                                {QUARTERS_RU[props.period]}
                            </th>
                            {PERIODS[props.period] !== 'fourth' || (
                                <th
                                    style={{
                                        width: '5%',
                                        whiteSpace: 'nowrap',
                                        margin: '10px',
                                    }}
                                >
                                    Год
                                </th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            {cells.map((cell) => (
                                <td
                                    style={{color: props.archived ? 'gray' : 'black'}}
                                    key={cell}
                                >
                                    {props.marks[cell] ? props.marks[cell] : ' '}
                                </td>
                            ))}
                            <td>
                                {props.quater.find(
                                    (item) => item.period === PERIODS[props.period]
                                )?.mark || ''}
                            </td>
                            {PERIODS[props.period] !== 'fourth' || (
                                <td>
                                    {props.quater.find((item) => item.period === 'year')
                                        ?.mark || ''}
                                </td>
                            )}
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const TeacherJournal = (props) => {
        const {
            loading,
            data: journal,
            error,
            networkStatus,
        } = useQuery(FETCH_JOURNAL_QUERY, {
            variables: {
                courseId: props.courseId,
                teacherId: props.teacherIndex,
                date_gte: moment()
                    .month(QUARTERS[props.period][0])
                    .year(props.period > 1 ? props.year + 1 : props.year)
                    .startOf('month')
                    .utc()
                    .format('YYYY-MM-DDTHH:mm:ss.SSS')
                    .concat('Z'),
                date_lte: moment()
                    .month(QUARTERS[props.period].slice(-1)[0])
                    .year(props.period > 1 ? props.year + 1 : props.year)
                    .endOf('month')
                    .utc()
                    .format('YYYY-MM-DDTHH:mm:ss.SSS')
                    .concat('Z'),
                year: props.year,
            },
            fetchPolicy: 'network-only',
        });

        if (props.courseId === 0) {
            return <p>На данный момент для этого учителя нет данных</p>;
        }

        if (loading) return spinner;
        if (networkStatus === networkStatus.refetch) return spinner;

        if (error) throw new Error(503);

        if (journal.fetchJournal[0].student === null) {
            return <p>Для данного предмета еще не назначены ученики</p>;
        }

        return journal.fetchJournal.map((item) => {
            const name = `${item.student.surname} ${item.student.name}`;
            const hours = `${item.hours}`;
            const dates = item.journalEntry.map((entry) => entry.date);
            const marks = item.journalEntry.map((entry) => entry.mark);
            const quater = item.quaterMark;
            return (
                <StudentItem
                    name={name}
                    hours={hours}
                    dates={dates}
                    marks={marks}
                    cells={15}
                    quater={quater}
                    key={name}
                    period={props.period}
                    archived={item.archived}
                />
            );
        });
    };

    const getPeriod = (e) => {
        setPeriod(e.target.getAttribute('data-index'));
    };

    const getCourse = (e) => {
        setCourse(e.target.getAttribute('data-index'));
    };

    const items = [
        {
            type: 'dropdown',
            data: QUARTERS_RU,
            label: 'Период :',
            text: QUARTERS_RU[period],
            onClick: getPeriod,
        },
        {
            type: 'dropdown',
            data: teachers?.fetchTeachers
                ?.find((teacher) => teacher.id === teacherIndex)
                ?.relations.map((item) => item.course.name),
            label: 'Предмет :',
            text: teachers?.fetchTeachers?.find(
                (teacher) => teacher.id === teacherIndex
            )?.relations[course]?.course?.name,
            onClick: getCourse,
        },
        {
            type: 'button',
            text: 'Редактировать журнал',
            onClick: () => {
                if (
                    teachers.fetchTeachers.find(
                        (teacher) =>
                            teacher.id === (teacherIndex || teachers.fetchTeachers[0].id)
                    ).relations[course]?.course?.id !== undefined
                )
                    history.push({
                        pathname: '/journal',
                        state: {
                            teacher: teacherIndex || teachers.fetchTeachers[0].id,
                            courses: teachers.fetchTeachers
                                .find(
                                    (teacher) =>
                                        teacher.id ===
                                        (teacherIndex || teachers.fetchTeachers[0].id)
                                )
                                .relations.map((item) => item.course),
                        },
                    });
            },
            disabled: course.id === 0,
        },
        {
            type: 'button',
            text: 'Консультации',
            onClick: () => {
                if (
                    teachers.fetchTeachers.find(
                        (teacher) =>
                            teacher.id === (teacherIndex || teachers.fetchTeachers[0].id)
                    ).relations[course]?.course?.id !== undefined
                )
                    history.push({
                        pathname: '/consult',
                        state: {
                            teacher: teacherIndex || teachers.fetchTeachers[0].id,
                            courses: teachers.fetchTeachers
                                .find(
                                    (teacher) =>
                                        teacher.id ===
                                        (teacherIndex || teachers.fetchTeachers[0].id)
                                )
                                .relations.map((item) => item.course),
                        },
                    });
            },
            disabled: course.id === 0,
        },
        {
            type: 'button',
            text: 'Возмещения',
            onClick: () => {
                if (
                    teachers.fetchTeachers.find(
                        (teacher) =>
                            teacher.id === (teacherIndex || teachers.fetchTeachers[0].id)
                    ).relations[course]?.course?.id !== undefined
                )
                    history.push({
                        pathname: '/compensation',
                        state: {
                            teacher: teacherIndex || teachers.fetchTeachers[0].id,
                            courses: teachers.fetchTeachers
                                .find(
                                    (teacher) =>
                                        teacher.id ===
                                        (teacherIndex || teachers.fetchTeachers[0].id)
                                )
                                .relations.map((item) => item.course),
                        },
                    });
            },
            disabled: course.id === 0,
        },
        {
            type: 'button',
            text: 'Заметки',
            onClick: () => {
                if (
                    teachers.fetchTeachers.find(
                        (teacher) =>
                            teacher.id === (teacherIndex || teachers.fetchTeachers[0].id)
                    ).relations[course]?.course?.id !== undefined
                )
                    history.push({
                        pathname: '/notes',
                        state: {
                            teacher: teacherIndex || teachers.fetchTeachers[0].id,
                            courses: teachers.fetchTeachers
                                .find(
                                    (teacher) =>
                                        teacher.id ===
                                        (teacherIndex || teachers.fetchTeachers[0].id)
                                )
                                .relations.map((item) => item.course),
                        },
                    });
            },
            disabled: course.id === 0,
        },
    ];

    return (
        <div className='page'>
            <div className='block_left'>
                <ul>
                    {teachers.fetchTeachers.map((teacher) => (
                        <ListItem
                            name={`${teacher.surname} ${teacher.name} ${
                                teacher?.parent || ''
                            }`}
                            index={teacher.id}
                            key={teacher.id}
                        />
                    ))}
                </ul>
            </div>
            <div className='block_right'>
                {/*   TODO: temporary disabled
             <Controls items={items}/>*/}
                <TeacherJournal
                    teacherIndex={teacherIndex || teachers.fetchTeachers[0].id}
                    period={period}
                    year={moment().year()}
                    key={teacherIndex}
                    courseId={
                        teachers?.fetchTeachers?.find(
                            (teacher) =>
                                teacher.id === (teacherIndex || teachers.fetchTeachers[0].id)
                        )?.relations[course]?.course?.id || 0
                    }
                />
            </div>
        </div>
    );
};

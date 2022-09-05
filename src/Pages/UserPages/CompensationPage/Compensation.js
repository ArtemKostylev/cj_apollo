import {NetworkStatus, useMutation, useQuery} from '@apollo/client';
import moment from 'moment';
import React, {useState, Fragment} from 'react';
import {UPDATE_REPLACEMENTS_MUTATION} from '../../../utils/mutations';
import {FETCH_REPLACEMENTS_QUERY} from '../../../utils/queries';
import {useAuth} from '../../../utils/use-auth';
import EditableDateCell from '../../../shared/ui/EditableDateCell';
import TableControls from '../../../shared/ui/TableControls';
import {getYear} from '../../../utils/utils';
import '../../../styles/Compensation.css';

export default function Compensation(props) {
    let auth = useAuth();

    const [course, setCourse] = useState(0);
    const [month, setMonth] = useState(moment().month());
    const [selectedYear, setSelectedYear] = useState(`${moment().year()}`);

    const year = getYear(month, selectedYear);

    var {loading, data, error, refetch, networkStatus} = useQuery(
        FETCH_REPLACEMENTS_QUERY,
        {
            variables: {
                teacherId: props.location.state?.teacher || auth.user.teacher,
                courseId:
                    props.location.state?.courses[course].id ||
                    auth.user.courses[course].id,
                date_gte: moment()
                    .month(month)
                    .year(year)
                    .clone()
                    .startOf('month')
                    .utc()
                    .format('YYYY-MM-DDTHH:mm:ss.SSS')
                    .concat('Z'),
                date_lte: moment()
                    .month(month)
                    .year(year)
                    .clone()
                    .endOf('month')
                    .utc()
                    .format('YYYY-MM-DDTHH:mm:ss.SSS')
                    .concat('Z'),
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only',
        }
    );

    const [update] = useMutation(UPDATE_REPLACEMENTS_MUTATION);

    const save = async () => {
        var result = [];
        studentData.forEach((student) => {
            student.journalEntry.forEach((mark) => {
                if (mark.replacement)
                    result.push({
                        id: mark.replacement.id,
                        date: mark.replacement.date,
                        entryId: mark.id,
                    });
            });
        });

        await update({
            variables: {
                data: result,
            },
        });

        refetch();
    };

    const spinner = <div>Загрузка</div>;

    if (loading) return spinner;

    if (networkStatus === NetworkStatus.refetch) return spinner;

    if (error) throw new Error(503);

    var studentData = [];

    data.fetchReplacements.forEach((student) => {
        if (student.journalEntry.length > 0) {
            studentData.push(student);
        }
    });

    const updateDates = ({date, column, group, row}) => {
        const student = studentData.find((item, index) => item.student.id === row);
        const studentIndex = studentData.indexOf(student);
        var mark = student.journalEntry.find((item) => item.id === group);
        const markIndex = student.journalEntry.indexOf(mark);

        date = date?.toLocaleDateString('ru-RU').split('.');
        const newRepl = {
            id: !mark?.replacement ? 0 : column,
            date: `${date[2]}-${date[1]}-${date[0]}`.concat('T00:00:00.000Z'),
            entryId: group,
        };

        studentData = [
            ...studentData.slice(0, studentIndex),
            {
                ...studentData[studentIndex],
                journalEntry: [
                    ...studentData[studentIndex].journalEntry.slice(0, markIndex),
                    {
                        ...studentData[studentIndex].journalEntry[markIndex],
                        replacement: newRepl,
                    },
                    ...studentData[studentIndex].journalEntry.slice(markIndex + 1),
                ],
            },
            ...studentData.slice(studentIndex + 1),
        ];
    };

    return (
        <>
            <TableControls
                initialMonth={month}
                setMonth={setMonth}
                save={save}
                courses={props.location.state?.courses || auth.user.courses}
                course={course}
                setCourse={setCourse}
                setYear={setSelectedYear}
                year={selectedYear}
                refetch={() => refetch()}
            />
            <table className='compensation_table'>
                <thead>
                <tr>
                    <th className='name_column'>Имя ученика</th>
                    {Array(10)
                        .fill(1)
                        .map((item, index) => (
                            <Fragment key={index}>
                                <th>Пропуск</th>
                                <th>Выдано</th>
                            </Fragment>
                        ))}
                </tr>
                </thead>
                <tbody>
                {studentData.map((item) => {
                    return (
                        <tr>
                            <td className='name_cell'>{`${item.student.surname} ${item.student.name}`}</td>
                            {Array(10)
                                .fill(1)
                                .map((num, index) => {
                                    let lesson = null;
                                    let lesson_date = null;
                                    let repl = null;
                                    if (item.journalEntry[index]) {
                                        lesson = item.journalEntry[index];
                                        lesson_date = lesson.date.split('T')[0];
                                        if (lesson.replacement) repl = lesson.replacement;
                                    }

                                    return (
                                        <Fragment key={index}>
                                            <td className='name_cell'>
                                                {lesson_date
                                                    ? `${lesson_date.split('-')[2]}.${
                                                        lesson_date.split('-')[1]
                                                    }.${lesson_date.split('-')[0]}`
                                                    : ''}
                                            </td>
                                            <td>
                                                {lesson ? (
                                                    <EditableDateCell
                                                        initialValue={
                                                            repl ? new Date(repl.date.split('T')[0]) : ''
                                                        }
                                                        column={repl ? repl.id : 0}
                                                        group={lesson.id}
                                                        row={item.student.id}
                                                        updateDates={updateDates}
                                                        month={month - 1}
                                                        year={selectedYear}
                                                        unlimited
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </td>
                                        </Fragment>
                                    );
                                })}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </>
    );
}

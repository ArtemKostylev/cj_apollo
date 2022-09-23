import React from 'react';
import {QUARTER_END, QUARTERS_RU} from '../../../constants/quarters';
import {PROGRAMS} from '../../../constants/programs';
import {findMark} from './JournalPageHelpers';
import moment from 'moment';
import '../../../styles/Journal.css';
import {Index} from '../../../shared/ui/EditableCell/EditableCell';
import {MARKS_OPTIONS, HOURS_OPTIONS} from '../../../constants/marksOptions';

const QUARTER_END_MONTHS = [9, 11, 2, 4];

const IndividualJournalView = ({
                                   parsedDates,
                                   month,
                                   updateQuarterData,
                                   updateMyData,
                                   studentData,
                                   onlyHours,
                               }) => {
    const getQuarterMark = (item) => {
        if (QUARTER_END[month]) {
            const mark = item.quaterMark.find(
                (mark) => mark.period === QUARTER_END[month]
            );
            const year =
                month === 4
                    ? item.quaterMark.find((mark) => mark.period === 'year')
                    : null;

            return (
                <>
                    <Index
                        value={mark && mark.mark}
                        onClick={(value) =>
                            updateQuarterData({
                                row: item.student.id,
                                column: mark ? mark.period : QUARTER_END[month],
                                value,
                            })
                        }
                        options={MARKS_OPTIONS}
                    />
                    {year !== null && (
                        <Index
                            value={year && year.mark}
                            updateMyData={updateQuarterData}
                            onClick={(value) =>
                                updateQuarterData({
                                    row: item.student.id,
                                    column: year ? year.period : 'year',
                                    value,
                                })
                            }
                            options={MARKS_OPTIONS}
                        />
                    )}
                </>
            );
        }
        return '';
    };

    return (
        <>
            <table className='journal_table'>
                <thead>
                <tr>
                    <th className='name_column' rowSpan='2'>
                        Имя ученика
                    </th>
                    <th rowSpan='2'>Класс</th>
                    {parsedDates.map((date) => (
                        <th key={date}>{date.format('DD.MM')}</th>
                    ))}
                    {!onlyHours && QUARTER_END_MONTHS.includes(month) && (
                        <th rowSpan='2' className='quarter_column'>
                            {`${QUARTERS_RU[QUARTER_END_MONTHS.indexOf(month)]}`}
                        </th>
                    )}
                    {!onlyHours && month === 4 && (
                        <th rowSpan='2' className='quarter_column'>
                            {`Год`}
                        </th>
                    )}
                </tr>
                <tr>
                    {parsedDates.map((date) => (
                        <th key={date}>{moment.weekdaysMin(date.isoWeekday())}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {studentData
                    .sort((a, b) => {
                        if (a.student.class < b.student.class) return -1;
                        if (a.student.class > b.student.class) return 1;
                        return 0;
                    })
                    .map((item) => (
                        <tr key={item.student.id}>
                            <td
                                className='name_cell'
                                style={{color: item.archived ? 'gray' : 'black'}}
                            >
                                {`${item.student.surname} ${item.student.name} ${
                                    item.archived ? '(A)' : ''
                                }`}
                            </td>
                            <td
                                className='name_cell'
                                style={{color: item.archived ? 'gray' : 'black'}}
                            >
                                {`${item.student.class}${
                                    PROGRAMS[`${item.student.program}`]
                                }`}
                            </td>
                            {parsedDates.map((date, index) => (
                                <Index
                                    key={date}
                                    value={findMark(date, item.journalEntry)}
                                    onClick={(value) =>
                                        updateMyData({
                                            row: item.student.id,
                                            column: index,
                                            value,
                                        })
                                    }
                                    isWeekend={date.isoWeekday() === 6}
                                    disabled={item.archived}
                                    options={onlyHours ? HOURS_OPTIONS : MARKS_OPTIONS}
                                />
                            ))}
                            {!onlyHours && getQuarterMark(item)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default IndividualJournalView;

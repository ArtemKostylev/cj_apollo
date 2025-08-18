import { useMemo } from 'react';
import { getQuarter } from '../../../utils/academicDate';
import moment from 'moment';
import { Quarters, QUARTERS_RU } from '../../../constants/date';
import styles from './studentsRow.module.css';
import { Table } from '~/components/table';
import { TableHeader } from '~/components/table/tableHeader';
import { TableCell } from '~/components/cells/TableCell';

interface Props {
    rowLength: number;
    dates: string[];
    archived: boolean;
    studentName: string;
    lessonsCount: number;
    marks: string[];
    quarterMarks: QuarterMark[];
}

const formatDate = (date: string | undefined) => {
    if (!date) return '...';
    const [month, day] = date.split('T')[0].split('-').slice(1);
    return `${day}.${month}`;
};

export const StudentRow = (props: Props) => {
    const {
        rowLength,
        dates,
        archived,
        studentName,
        lessonsCount,
        marks,
        quarterMarks
    } = props;

    const cells = useMemo(
        () =>
            Array(rowLength)
                .fill(0)
                .map((_, index) => index),
        [rowLength]
    );
    const quarter = useMemo(() => getQuarter(moment().month()), []);

    return (
        <div className={styles.teacherItem}>
            <div className={styles.itemHeader}>
                <p>{studentName}</p>
                <p>{archived ? '(A)' : ''}</p>
                <p>{`Выдано уроков: ${lessonsCount}`}</p>
            </div>
            <div className={styles.itemData}>
                <Table>
                    <thead>
                        <tr>
                            {cells.map((cellIndex) => (
                                <TableHeader key={cellIndex}>
                                    {formatDate(dates[cellIndex])}
                                </TableHeader>
                            ))}
                            <TableHeader
                                style={{
                                    width: '10%',
                                    whiteSpace: 'nowrap',
                                    margin: '10px'
                                }}
                            >
                                {QUARTERS_RU[quarter]}
                            </TableHeader>
                            {quarter !== Quarters.FOURTH || (
                                <TableHeader
                                    style={{
                                        width: '5%',
                                        whiteSpace: 'nowrap',
                                        margin: '10px'
                                    }}
                                >
                                    Год
                                </TableHeader>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {cells.map((cell) => (
                                <TableCell
                                    style={{
                                        color: archived ? 'gray' : 'black'
                                    }}
                                    key={cell}
                                >
                                    {marks[cell] ? marks[cell] : ' '}
                                </TableCell>
                            ))}
                            <TableCell>
                                {quarterMarks.find(
                                    (item) => item.period === quarter
                                )?.mark || ''}
                            </TableCell>
                            {quarter !== Quarters.FOURTH || (
                                <TableCell>
                                    {quarterMarks.find(
                                        (item) => item.period === Quarters.YEAR
                                    )?.mark || ''}
                                </TableCell>
                            )}
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

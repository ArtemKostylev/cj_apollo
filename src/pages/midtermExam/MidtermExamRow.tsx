import classNames from 'classnames';
import { TableCell } from '~/components/cells/tableCell';
import styles from './midtermExam.module.css';
import type { MidtermExam } from '~/models/midtermExam';

interface Props {
    item: MidtermExam;
    selectedRecord: MidtermExam | undefined;
    onRowClick: (item: MidtermExam) => void;
}

export const MidtermExamRow = (props: Props) => {
    const { item, selectedRecord, onRowClick } = props;

    const className = classNames(styles.row, {
        [styles.selected]: item.index === selectedRecord?.index
    });

    return (
        <tr className={className} onClick={() => onRowClick(item)}>
            <TableCell>{item.index + 1}</TableCell>
            <TableCell>{item.studentName}</TableCell>
            <TableCell>{item.studentClass}</TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>{item.typeName}</TableCell>
            <TableCell>{item.contents}</TableCell>
            <TableCell>{item.result}</TableCell>
        </tr>
    );
};

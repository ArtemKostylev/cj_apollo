import { TableHeader } from '../tableHeader';
import styles from './nameHeader.module.css';

type Props = {
    rowSpan?: number;
};

export const NameHeader = ({ rowSpan }: Props) => (
    <TableHeader className={styles.header} rowSpan={rowSpan}>
        Имя ученика
    </TableHeader>
);

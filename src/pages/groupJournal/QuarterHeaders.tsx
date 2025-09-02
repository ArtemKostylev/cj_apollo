import { memo } from 'react';
import { Periods } from '../../constants/date';
import styles from './quarterHeader.module.css';
import { TableHeader } from '~/components/table/tableHeader';

type Props = {
    period: Periods;
    onlyHours: boolean;
};

export const QuarterHeaders = memo(({ period, onlyHours }: Props) => {
    if (onlyHours) return null;

    if (period == Periods.FIRST)
        return (
            <>
                <TableHeader className={styles.quarterHeader} rowSpan={2} width="50px">
                    I четверть
                </TableHeader>
                <TableHeader className={styles.quarterHeader} rowSpan={2} width="50px">
                    II четверть
                </TableHeader>
            </>
        );

    return (
        <>
            <TableHeader className={styles.quarterHeader} rowSpan={2} width="50px">
                III четверть
            </TableHeader>
            <TableHeader className={styles.quarterHeader} rowSpan={2} width="50px">
                IV четверть
            </TableHeader>
            <TableHeader className={styles.quarterHeader} rowSpan={2} width="50px">
                Годовая оценка
            </TableHeader>
        </>
    );
});

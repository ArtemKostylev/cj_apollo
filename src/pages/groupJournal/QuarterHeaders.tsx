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
                <TableHeader className={styles.quarterHeader} rowSpan={2}>
                    I четверть
                </TableHeader>
                <TableHeader className={styles.quarterHeader} rowSpan={2}>
                    II четверть
                </TableHeader>
            </>
        );

    return (
        <>
            <TableHeader className={styles.quarterHeader} rowSpan={2}>
                III четверть
            </TableHeader>
            <TableHeader className={styles.quarterHeader} rowSpan={2}>
                IV четверть
            </TableHeader>
            <TableHeader className={styles.quarterHeader} rowSpan={2}>
                Годовая оценка
            </TableHeader>
        </>
    );
});

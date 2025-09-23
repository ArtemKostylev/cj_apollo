import { memo } from 'react';
import { Periods, Quarters, QUARTERS_RU } from '../../constants/date';
import styles from './quarterHeader.module.css';
import { TableHeader } from '~/components/table1/tableHeader';

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
                    {QUARTERS_RU[Quarters.FIRST]}
                </TableHeader>
                <TableHeader className={styles.quarterHeader} rowSpan={2} width="50px">
                    {QUARTERS_RU[Quarters.SECOND]}
                </TableHeader>
            </>
        );

    return (
        <>
            <TableHeader className={styles.quarterHeader} rowSpan={2} width="50px">
                {QUARTERS_RU[Quarters.THIRD]}
            </TableHeader>
            <TableHeader className={styles.quarterHeader} rowSpan={2} width="50px">
                {QUARTERS_RU[Quarters.FOURTH]}
            </TableHeader>
            <TableHeader className={styles.quarterHeader} rowSpan={2} width="50px">
                {QUARTERS_RU[Quarters.YEAR]}
            </TableHeader>
        </>
    );
});

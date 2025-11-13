import { memo } from 'react';
import { PROGRAMS } from '~/constants/programs';
import { TableCell } from '../tableCell';
import styles from './classCell.module.css';

type Props = {
    classNum: number | undefined;
    program: string | undefined;
    subgroup?: number;
    archived?: boolean;
};

export const ClassCell = memo(({ classNum, program, subgroup, archived }: Props) => {
    const classNumStr = classNum || '';
    const programStr = program ? PROGRAMS[program] : '';
    const subgroupStr = subgroup || '';
    const archivedStr = archived ? '(А)' : '';

    return <TableCell className={styles.classCell} disabled={archived}>{`${classNumStr} ${programStr} ${subgroupStr} ${archivedStr}`}</TableCell>;
});

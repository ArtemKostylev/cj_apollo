import { memo } from 'react';
import { PROGRAMS } from '../../constants/programs';
import classNames from 'classnames';
import styles from './nameCell.module.css';

type Props = {
    classNum: number | undefined;
    program: string | undefined;
    subgroup?: number;
    archived?: boolean;
};

export const ClassCell = memo(
    ({ classNum, program, subgroup, archived }: Props) => {
        const classNumStr = classNum || '';
        const programStr = program ? PROGRAMS[program] : '';
        const subgroupStr = subgroup || '';
        const archivedStr = archived ? '(А)' : '';

        const className = classNames(styles.classCell, styles.nameCell, {
            [styles.archived]: archived
        });

        return (
            <td className={className}>
                {`${classNumStr} ${programStr} ${subgroupStr} ${archivedStr}`}
            </td>
        );
    }
);

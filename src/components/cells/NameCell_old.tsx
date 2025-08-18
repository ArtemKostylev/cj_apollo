import { memo } from 'react';
import classNames from 'classnames';
import styles from './nameCell.module.css';

interface Props {
    name: string;
    surname: string;
    archived?: boolean;
}

export const NameCell_old = memo(({ name, surname, archived }: Props) => {
    const className = classNames(styles.nameCell, {
        [styles.archived]: archived
    });

    return (
        <td className={className}>
            {`${surname} ${name} ${archived ? '(A)' : ''}`}
        </td>
    );
});

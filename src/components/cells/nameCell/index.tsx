import { memo } from 'react';
import classNames from 'classnames';
import styles from './nameCell.module.css';

interface Props {
    name: string;
    archived?: boolean;
}

export const NameCell = memo((props: Props) => {
    const { name, archived } = props;

    const className = classNames(styles.nameCell, {
        [styles.archived]: archived
    });

    return (
        <td className={className}>
            {name}
            {archived && '(A)'}
        </td>
    );
});

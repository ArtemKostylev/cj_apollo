import { forwardRef, type PropsWithChildren } from 'react';
import styles from './table.module.css';
import classNames from 'classnames';

interface Props extends PropsWithChildren {
    className?: string;
    style?: React.CSSProperties;
}

export const Table = forwardRef<HTMLTableElement, Props>(({ children, className, style }, ref) => {
    const tableClassName = classNames(styles.table, className);

    return (
        <table ref={ref} className={tableClassName} style={style}>
            {children}
        </table>
    );
});

Table.displayName = 'Table';

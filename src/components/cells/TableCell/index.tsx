import {
    forwardRef,
    type MouseEventHandler,
    type PropsWithChildren
} from 'react';
import classNames from 'classnames';
import styles from './tableCell.module.css';

interface Props {
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement> & ((e: HTMLDivElement) => void);
    isWeekend?: boolean;
    className?: string;
}

export const TableCell = forwardRef<any, PropsWithChildren<Props>>(
    ({ disabled, onClick, children, isWeekend, className }, ref) => {
        const outerClassName = classNames(
            styles.outer,
            {
                [styles.weekend]: isWeekend,
                [styles.disabled]: disabled,
                [styles.clickable]: onClick
            },
            className
        );
        return (
            <td ref={ref} className={outerClassName} onClick={onClick}>
                <div className={styles.inner}>
                    <span className={styles.text}>{children}</span>
                </div>
            </td>
        );
    }
);

import { ForwardedRef, MouseEventHandler, forwardRef, memo } from 'react';
import styles from './dateCell.module.css';
import { DATE_FORMAT, EMPTY_DATE } from './const';
import { format } from 'date-fns';

interface Props {
    value?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export const DateHeaderInput = memo(
    forwardRef(({ value, onClick }: Props, ref: ForwardedRef<any>) => (
        <div className={styles.dateHeaderInput} onClick={onClick} ref={ref}>
            {value ? format(new Date(value), DATE_FORMAT) : EMPTY_DATE}
        </div>
    ))
);

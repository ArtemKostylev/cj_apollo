import { ForwardedRef, MouseEventHandler, forwardRef, memo } from 'react';
import styles from './dateHeader.module.css';
import { EMPTY_DATE } from './const';
import { format } from 'date-fns';
import { DATE_FORMAT_SHORT } from '~/constants/date';

interface Props {
    value?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export const DateCellCustomInput = memo(
    forwardRef(({ value, onClick }: Props, ref: ForwardedRef<any>) => (
        <div className={styles.dateHeaderInput} onClick={onClick} ref={ref}>
            {value ? format(new Date(value), DATE_FORMAT_SHORT) : EMPTY_DATE}
        </div>
    ))
);

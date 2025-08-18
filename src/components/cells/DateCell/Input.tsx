import { ForwardedRef, MouseEventHandler, forwardRef, memo } from 'react';
import { convertDate } from './utils';
import styles from './dateCell.module.css';

interface InputProps {
    value?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
    short?: boolean;
}

export const Input = memo(
    forwardRef(
        ({ value, onClick, short }: InputProps, ref: ForwardedRef<any>) => (
            <div className={styles.inputWrapper} onClick={onClick} ref={ref}>
                {convertDate(value, !short)}
            </div>
        )
    )
);

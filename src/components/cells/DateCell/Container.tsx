import { ReactNode, memo } from 'react';
import { CalendarContainer } from 'react-datepicker';
import styles from './dateCell.module.css';

interface ContainerProps {
    className: string;
    children: ReactNode;
}

export const Container = memo(({ className, children }: ContainerProps) => (
    <div className={styles.container}>
        <CalendarContainer className={className}>{children}</CalendarContainer>
    </div>
));

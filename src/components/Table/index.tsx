import { type PropsWithChildren } from 'react';
import styles from './table.module.css';

export const Table = ({ children }: PropsWithChildren) => (
    <table className={styles.table}>{children}</table>
);

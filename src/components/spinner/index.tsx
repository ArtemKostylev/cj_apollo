import type { PropsWithChildren } from 'react';
import styles from './spinner.module.css';

export const Spinner = (props: PropsWithChildren) => {
    const { children } = props;
    return <div className={styles.spinner}>{children}</div>;
};

import styles from './tableControls.module.css';
import type { PropsWithChildren } from 'react';

export const TableControls = (props: PropsWithChildren) => {
    const { children } = props;

    return <div className={styles.controlsContainer}>{children}</div>;
};

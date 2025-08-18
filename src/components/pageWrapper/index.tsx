import type { PropsWithChildren } from 'react';
import styles from './pageWrapper.module.css';

export const PageWrapper = (props: PropsWithChildren) => {
    const { children } = props;
    return <div className={styles.pageWrapper}>{children}</div>;
};

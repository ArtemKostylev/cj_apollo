import type { PropsWithChildren } from 'react';
import styles from './relations.module.css';

export const RelationsColumn = (props: PropsWithChildren) => {
    return <div className={styles.relationsColumn}>{props.children}</div>;
};

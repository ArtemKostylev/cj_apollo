import type { PropsWithChildren } from 'react';
import styles from './label.module.css';

interface Props {
    htmlFor: string;
}

export const Label = (props: PropsWithChildren<Props>) => {
    const { children, htmlFor } = props;

    return (
        <label className={styles.label} htmlFor={htmlFor}>
            {children}
        </label>
    );
};

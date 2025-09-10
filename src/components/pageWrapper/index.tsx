import type { PropsWithChildren } from 'react';
import styles from './pageWrapper.module.css';
import classNames from 'classnames';

interface Props {
    className?: string;
}

export const PageWrapper = (props: PropsWithChildren<Props>) => {
    const { children, className } = props;
    return <div className={classNames(styles.pageWrapper, className)}>{children}</div>;
};

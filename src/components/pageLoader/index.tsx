import { memo, type PropsWithChildren } from 'react';
import { Spinner } from '~/components/spinner';
import styles from './pageLoader.module.css';

interface Props {
    loading: boolean;
    error: boolean;
}

export const PageLoader = memo((props: PropsWithChildren<Props>) => {
    const { loading, error, children } = props;

    if (error) throw new Error('503');

    if (loading)
        return (
            <div className={styles.loader}>
                <Spinner />
            </div>
        );

    return <>{children}</>;
});

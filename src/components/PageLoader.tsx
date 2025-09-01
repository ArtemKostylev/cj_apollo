import { memo, type PropsWithChildren } from 'react';
import { Spinner } from '~/components/spinner';

interface Props {
    loading: boolean;
    error: boolean;
}

export const PageLoader = memo((props: PropsWithChildren<Props>) => {
    const { loading, error, children } = props;

    if (loading) return <Spinner />;
    if (error) throw new Error('503');

    return <>{children}</>;
});

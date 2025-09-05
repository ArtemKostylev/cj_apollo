import { PageWrapper } from '~/components/pageWrapper';
import { Button } from '~/components/button';
import { useQuery } from '@tanstack/react-query';
import { PageLoader } from '~/components/pageLoader';
import { fetchAnnualReport } from '~/api/reports';

export const Reports = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['reports'],
        queryFn: fetchAnnualReport
    });

    return (
        <PageWrapper>
            <PageLoader loading={isLoading} error={isError}>
                <a href={data}>Ссылка для скачивания ведомости</a>
                <Button onClick={() => refetch()}>{`Переформировать ведомость`}</Button>
            </PageLoader>
        </PageWrapper>
    );
};

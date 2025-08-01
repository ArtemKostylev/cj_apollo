import React from 'react';
import {PageWrapper} from '../../../ui/PageWrapper';
import {Button} from '../../../ui/Button';
import {useQuery} from '@apollo/client';
import {FETCH_ANNUAL_REPORT} from '../../../graphql/queries/fetchAnnualReport';
import {Spinner} from '../../../ui/Spinner';

export const Reports = () => {
    const {data, loading, error, refetch} = useQuery(FETCH_ANNUAL_REPORT, {
        variables: {
            year: 2024,
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only',
    });

    if (loading) return <Spinner/>;

    if (error) throw new Error(503);

    return (
        <PageWrapper>
            <a href={data.fetchAnnualReport}>Ссылка для скачивания ведомости</a>
            <Button onClick={() => refetch()}>{`Переформировать ведомость`}</Button>
        </PageWrapper>
    );
};

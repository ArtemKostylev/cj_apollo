import React from 'react';
import { PageWrapper } from '../../../shared/ui/PageWrapper';
import { Button } from '../../../shared/ui/Button';
import { useQuery } from '@apollo/client';
import { FETCH_ANNUAL_REPORT } from '../../../utils/queries';
import { Spinner } from '../../../shared/ui/Spinner';

export const Reports = () => {
  const { data, loading, error, refetch } = useQuery(FETCH_ANNUAL_REPORT, {
    variables: {
      year: 2021,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  if (loading) return <Spinner />;

  if (error) throw new Error(503);

  return (
    <PageWrapper>
      <a href={data.fetchAnnualReport}>Ссылка для скачивания ведомости</a>
      <Button onClick={() => refetch()}>{`Переформировать ведомость`}</Button>
    </PageWrapper>
  );
};

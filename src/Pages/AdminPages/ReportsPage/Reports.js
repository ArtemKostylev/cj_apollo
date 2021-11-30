import React from 'react';
import { Wrapper } from '../../../components/shared/ui/Wrapper';
import { Button } from '../../../components/shared/ui/Button';
import { useQuery } from '@apollo/client';
import { FETCH_ANNUAL_REPORT } from '../../../scripts/queries';
import { Spinner } from '../../../components/shared/ui/Spinner';

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
    <Wrapper>
      <a href={data.fetchAnnualReport}>Ссылка для скачивания ведомости</a>
      <Button onClick={() => refetch()}>{`Переформировать ведомость`}</Button>
    </Wrapper>
  );
};

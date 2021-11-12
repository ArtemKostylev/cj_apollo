import React from "react";
import { Wrapper } from "../../../components/shared/ui/Wrapper";
import { Button } from "../../../components/shared/ui/Button";
import { useQuery } from "@apollo/client";
import { FETCH_ANNUAL_REPORT } from "../../../scripts/queries";
import { Text } from "../../../components/shared/ui/Text";
import { Spinner } from "../../../components/shared/ui/Spinner";

export const Reports = () => {
  const { data, loading, error, refetch } = useQuery(FETCH_ANNUAL_REPORT, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  if (loading) return <Spinner />;

  if (error) throw new Error(503);

  return (
    <Wrapper>
      <Text>{`Ссылка для скачивания ведомости: ${data.fetchAnnualReport}`}</Text>
      <Button onClick={() => refetch()}>{`Переформировать ведомость`}</Button>
    </Wrapper>
  );
};

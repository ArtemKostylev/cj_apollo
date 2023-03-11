import React, {useCallback} from 'react';
import {DocumentNode} from 'graphql';
import {ApolloError, useApolloClient, useQuery} from '@apollo/client';

export type Data<T> = {
  [key: string]: T[];
}

export type modifyEntity<T> = (value: T, fragment: DocumentNode) => void;
export type addToQuery<T> = (value: T) => void;
export type removeFromQuery<T> = (value: T) => void;

export type UseApollo<T> = [
  {
    data: T[] | undefined;
    loading: boolean;
    error: ApolloError | undefined;
    refetch: () => void;
  },
  modifyEntity<T>,
  addToQuery<T>,
  removeFromQuery<T>
];

export const useApollo = <T extends PrimitiveCacheEntity>(query: DocumentNode, variables: Record<string, any>, dataKey: string): UseApollo<T> => {
  const {data, loading, error, refetch} = useQuery<Data<T>>(query, {variables});

  const client = useApolloClient();
  const cache = client.cache;

  const modifyEntity = useCallback((value: Partial<T> & { id: number, __typename: string }, fragment: DocumentNode) => {
    const id = cache.identify(value);

    client.writeFragment({
      id,
      fragment,
      data: value
    })
  }, [cache, client]);

  const addToQuery = useCallback((value: T) => {
    const cachedData = client.readQuery<Data<T>>({
      query,
      variables
    }) || {};

    const items = cachedData?.[dataKey] || [];

    if (items.find(it => cache.identify(value) === cache.identify(it))) return;

    client.writeQuery({
      query,
      data: {
        [dataKey]: [...items, value]
      },
      variables
    });
  }, [cache, client, variables, query, dataKey]);

  const removeFromQuery = useCallback((value: T) => {
    const cachedData = client.readQuery<Data<T>>({
      query,
      variables
    }) || {};

    const items = cachedData?.[dataKey] || [];
    const filteredItems = items.filter(it => cache.identify(it) !== cache.identify(value))

    client.writeQuery({
      query,
      data: {
        [dataKey]: filteredItems
      },
      variables
    });
  }, [cache, client, variables, query, dataKey])

  return [{data: data?.[dataKey], loading, error, refetch}, modifyEntity, addToQuery, removeFromQuery];
}
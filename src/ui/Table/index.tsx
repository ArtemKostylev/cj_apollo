import React, { memo, useState } from 'react';
import { TableWrapper } from './style/TableWrapper.styled';
import { TableHeader } from './TableHeader';
import { useTableControls } from '../TableControls/useTableControls';
import { TableRow } from './TableRow';
import { DocumentNode } from 'graphql';
import { useApollo } from '../../hooks/useApolloCache';
import { Spinner } from '../Spinner';
import { TableControlsConfig } from '../TableControls/types';

type Props<T extends PrimitiveCacheEntity> = PrimitiveComponentProps & {
  fixed?: boolean;
  rowInfo: RowInfo<T>;
  controlsConfig: TableControlsConfig;
  fetchQuery: DocumentNode;
  updateQuery: DocumentNode;
  dataKey: string;
  typeName: string;
};

export const Table = memo(
  <T extends PrimitiveCacheEntity>({
    fixed,
    rowInfo,
    controlsConfig,
    updateQuery,
    fetchQuery,
    dataKey,
    typeName,
  }: Props<T>) => {
    const [selected, setSelected] = useState<number>();
    const [TableControls, variables] = useTableControls(controlsConfig);
    const [{ data, loading }, modifyEntity, addToQuery] = useApollo(
      fetchQuery,
      variables,
      dataKey
    );

    if (loading) return <Spinner />;
    if (!data) return <div />;

    return (
      <TableWrapper fixed={fixed}>
        <TableControls />
        <TableHeader rowInfo={rowInfo} />
        {Object.values(data).map((it) => (
          <TableRow
            key={it.id}
            item={it}
            updateMutation={updateQuery}
            rowInfo={rowInfo}
            refetchQueries={[{ query: fetchQuery }]}
            selected={it.id === selected}
            modifyEntity={modifyEntity}
            onRowClick={() => setSelected(it.id)}
            typeName={typeName}
          />
        ))}
      </TableWrapper>
    );
  }
);

import {DocumentNode} from 'graphql';
import React, {useCallback, useState} from 'react';
import {useMutation} from '@apollo/client';
import {Row} from './style/Row.styled';
import {createFragment, prepareData, validate} from './helpers';
import {componentMap} from './componentMap';
import {modifyEntity} from '../../../hooks/useApolloCache';

interface TableRowProps<T extends PrimitiveCacheEntity> {
  item: T;
  updateMutation: DocumentNode;
  rowInfo: RowInfo<T>;
  refetchQueries: [{ query: DocumentNode }];
  selected: boolean;
  onRowClick: () => void;
  modifyEntity: modifyEntity<T>;
  typeName: string;
}

// TODO: field can be an array (nested data)
export const TableRow = <T extends PrimitiveCacheEntity>({
                                                           item,
                                                           updateMutation,
                                                           rowInfo,
                                                           refetchQueries,
                                                           selected,
                                                           onRowClick,
                                                           modifyEntity,
                                                           typeName
                                                         }: TableRowProps<T>) => {
  const [erroredFields, setErroredFields] = useState<Record<keyof T, any>>();
  const [update] = useMutation(updateMutation);

  const onBlur = useCallback(() => {
    if (!validate(item, setErroredFields)) return;

    update({
      variables: {
        data: prepareData(item)
      },
      refetchQueries
    }).then(res => console.log(res));

  }, [item]);

  return (
    <Row selected={selected} onBlur={onBlur} onClick={onRowClick}>
      {Object.entries(rowInfo).map(([key, value]) => {
        const Component = componentMap[value.type];
        const onChange = (value: any) => modifyEntity({...item, [key]: value}, createFragment(typeName, key));
        return <Component value={item[key]} onChange={onChange} error={erroredFields?.[key]} options={value.options} disabled={value.disabled}/>;
      })}
    </Row>
  )
}
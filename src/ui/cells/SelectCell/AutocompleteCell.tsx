import React, {ChangeEvent, memo, useState} from 'react';
import {DocumentNode} from 'graphql';
import {OperationVariables, TypedDocumentNode, useQuery} from '@apollo/client';
import {SelectCell} from './index';
import {CellInput} from '../InputCell/style/CellInput.styled';

type Props = {
  value: string | number | undefined;
  searchQuery: DocumentNode | TypedDocumentNode<DropdownOptionType, OperationVariables>;
  searchVariables: Record<string, any>;
  onSelect: OnSelectType;
  keyPath: string;
}

export const AutocompleteCell = memo(({value, searchQuery, searchVariables, onSelect, keyPath}: Props) => {
  const [search] = useState(value);
  const [options, setOptions] = useState(new Map<string, DropdownOptionType>());

  const onInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setOptions(prev => {
      return new Map([...prev].filter(([_, item]) => item))
    })
  }

  const {loading, error} = useQuery<Record<string, DropdownOptionType[]>>(searchQuery, {
    variables: {...searchVariables},
    onCompleted: (res) => {
      const [items] = Object.values(res);
      setOptions(new Map(items?.map((it) => [it.text, it])))
    }
  });

  if (loading) return null;
  if (error) throw new Error('500');

  return (
    <SelectCell value={value} options={{selectOptions: options}} onChange={onSelect}/>
  )
});
import {SelectControlCreator} from '../types';
import {useQuery, useReactiveVar} from '@apollo/client';
import {Spinner} from '../../Spinner';
import {Select} from '../../formItems/Select';
import {toDropdownOption} from '../../../utils/normalizer';
import {useCallback} from 'react';

export const createRemoteSelectControl: SelectControlCreator<any> = (reactiveVar, optionsQuery, optionsVariables) => {
  if (!optionsQuery) throw new Error('No options query provided for select');
  return () => {
    const value = useReactiveVar(reactiveVar);
    const {data, loading} = useQuery(optionsQuery, {variables: optionsVariables});
    const onClick = useCallback((value: any) => reactiveVar(value), [value]);

    if (loading) return <Spinner/>;

    const options = toDropdownOption<any>(data.fetchOptions, it => it.displayName)

    return <Select options={options} text={value} onClick={onClick}/>
  }
}
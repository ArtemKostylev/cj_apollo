import {SelectControlCreator} from '../types';
import {useReactiveVar} from '@apollo/client';
import {useCallback} from 'react';
import {Select} from '../../formItems/Select';

export const createSelectControl: SelectControlCreator<any> = (reactiveVar, _, __, options) => {
  if (!options) throw new Error('No options provided for select');
  return () => {
    const value = useReactiveVar(reactiveVar);
    const onClick = useCallback((value: any) => reactiveVar(value), []);

    return <Select options={options} text={value} onClick={onClick}/>
  }
}
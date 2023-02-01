import {Select} from '../../formItems/Select';
import {useReactiveVar} from '@apollo/client';
import {YEARS} from '../../../constants/date';
import {SelectControlCreator} from '../types';
import {useCallback} from 'react';

export const createYearControl: SelectControlCreator<number> = (reactiveVar) => {
  return () => {
    const year = useReactiveVar(reactiveVar);
    const onClick = useCallback((value: number) => reactiveVar(value), [year]);

    return <Select options={YEARS} text={year} onClick={onClick}/>;
  };
}
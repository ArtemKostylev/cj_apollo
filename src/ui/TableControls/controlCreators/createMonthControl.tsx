import {Months, MONTHS_RU} from '../../../constants/date';
import {Select} from '../../formItems/Select';
import {useReactiveVar} from '@apollo/client';
import {SelectControlCreator} from '../types';
import {useCallback} from 'react';

export const createMonthControl: SelectControlCreator<Months> = (reactiveVar) => {
  return () => {
    const month = useReactiveVar(reactiveVar);
    const onClick = useCallback((value: Months) => reactiveVar(value), [month]);
    return <Select options={MONTHS_RU} text={month} onClick={onClick}/>
  }
}
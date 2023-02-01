import {SelectControlCreator} from '../types';
import {Periods, PERIODS_RU} from '../../../constants/date';
import {Select} from '../../formItems/Select';
import {useReactiveVar} from '@apollo/client';
import {useCallback} from 'react';

export const createPeriodControl: SelectControlCreator<Periods> = (reactiveVar) => {
  return () => {
    const period = useReactiveVar(reactiveVar);
    const onClick = useCallback((value: Periods) => reactiveVar(value), [period]);
    return <Select options={PERIODS_RU} text={period} onClick={onClick}/>
  }
}
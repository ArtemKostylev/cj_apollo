import React, {useCallback, useMemo} from 'react';
import {createYearControl} from './controlCreators/createYearControl';
import {makeVar, ReactiveVar} from '@apollo/client';
import {createMonthControl} from './controlCreators/createMonthControl';
import {createPeriodControl} from './controlCreators/createPeriodControl';
import {createButtonControl} from './controlCreators/createButtonControl';
import {createRemoteSelectControl} from './controlCreators/createRemoteSelectControl';
import {useReactiveVars} from './useReactiveVars';
import {Controls} from './style/Controls.styled';
import {ButtonConfig, ButtonControlCreator, SelectConfig, SelectControlCreator, TableControlsConfig, TableControlType} from './types';
import {getCurrentAcademicMonth, getCurrentAcademicPeriod, getCurrentAcademicYear} from '../../utils/academicDate';
import {createSelectControl} from './controlCreators/createSelectControl';
import {notNullOrUndefined} from '../../utils/common';

const selectControlCreators: Record<string, SelectControlCreator<any>> = {
  [TableControlType.YEAR]: createYearControl,
  [TableControlType.MONTH]: createMonthControl,
  [TableControlType.PERIOD]: createPeriodControl,
  [TableControlType.REMOTE_SELECT]: createRemoteSelectControl,
  [TableControlType.SELECT]: createSelectControl
}

const buttonControlCreators: Record<string, ButtonControlCreator> = {
  [TableControlType.BUTTON]: createButtonControl
}

const defaultInitialValues: Record<string, any> = {
  [TableControlType.YEAR]: getCurrentAcademicYear(),
  [TableControlType.MONTH]: getCurrentAcademicMonth(),
  [TableControlType.PERIOD]: getCurrentAcademicPeriod(),
  [TableControlType.SELECT]: undefined
}

const SELECT_TYPES = [TableControlType.YEAR, TableControlType.MONTH, TableControlType.PERIOD, TableControlType.SELECT, TableControlType.REMOTE_SELECT];
const BUTTON_TYPES = [TableControlType.BUTTON];

export const useTableControls = (config: TableControlsConfig): [() => JSX.Element, Record<string, any>] => {
  const [components, vars] = useMemo(() => {
    const components = [] as (() => JSX.Element)[];
    const vars = {} as Record<string, ReactiveVar<any>>;

    config.forEach(it => {
      if (SELECT_TYPES.includes(it.type)) {
        const item = it as SelectConfig;
        vars[item.name] = item.customVar || makeVar(notNullOrUndefined(item.initialValue) ? defaultInitialValues[it.type] : item.initialValue);
      }
    })

    config.forEach(it => {
      if (SELECT_TYPES.includes(it.type)) {
        const item = it as SelectConfig;
        const component = selectControlCreators[it.type](vars[item.name], item.optionsQuery, item.optionsVariables, item.options);
        components.push(component);
      }
      if (BUTTON_TYPES.includes(it.type)) {
        const item = it as ButtonConfig;
        const component = buttonControlCreators[it.type](item.onClick, item.label);
        components.push(component);
      }
    });

    return [components, vars]
  }, [])

  const TableControls = useCallback(() => (
    <Controls>
      {components.map((it, index) => {
        const Component = it;
        return <Component key={index}/>
      })}
    </Controls>), [components]);

  const variables = useReactiveVars(vars);

  return [TableControls, variables];
}
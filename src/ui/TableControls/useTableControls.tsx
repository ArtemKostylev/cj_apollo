import {useCallback, useMemo} from 'react';
import {makeVar, ReactiveVar} from '@apollo/client';
import {useReactiveVars} from './useReactiveVars';
import {Controls} from './style/Controls.styled';
import {ButtonConfig, SelectConfig, TableControlsConfig, TableControlType} from './types';
import {notNullOrUndefined} from '../../utils/common';
import { buttonControlCreators, defaultInitialValues, selectControlCreators } from './const';

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
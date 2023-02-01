import {ReactiveVar} from '@apollo/client';
import {useEffect, useState} from 'react';
import isEqual from 'lodash/isEqual';

const unpackVars = (vars: Record<string, ReactiveVar<any>>) => {
  const variables = {} as Record<string, any>;

  Object.entries(vars).forEach(([key, value]) => {
    variables[key] = value();
  });

  return variables;
}

export const useReactiveVars = (vars: Record<string, ReactiveVar<any>>) => {
  const variables = unpackVars(vars);

  const setVariables = useState(variables)[1];
  useEffect(() => {
    const probablySameValue = unpackVars(vars);
    if (!isEqual(variables, probablySameValue)) {
      setVariables(probablySameValue);
    } else {
      Object.entries(vars).forEach(([key, value]) => {
        value.onNextChange((v) => setVariables(prev => {
          prev[key] = v;
          return {...prev};
        }))
      })
    }
  }, [variables])

  return variables;
}
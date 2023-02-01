// TODO: extend validation capabilities with validation schema
import isEmpty from 'lodash/isEmpty';
import {isObject} from 'lodash';
import {gql} from '@apollo/client';

export const validate = <T extends PrimitiveCacheEntity>(item: T, updateState: (errors: Errors<T>) => void): boolean => {
  const errors: Errors<T> = {} as Errors<T>;
  Object.entries(item).forEach(([key, value]) => {
    if (key === 'id' || key === 'number') return;
    errors[key as keyof T] = isEmpty(value);
  })
  updateState(errors);
  return isEmpty(errors);
}

export const prepareData = <T extends PrimitiveCacheEntity>(item: T): Record<keyof T, string | number | boolean> => {
  const result = {} as Record<keyof T, string | number | boolean>;

  Object.entries(item).forEach(([key, value]) => {
    if (isObject(value)) {
      result[key as keyof T] = (value as PrimitiveCacheEntity).id;
    } else {
      result[key as keyof T] = value;
    }
  })

  return result;
}

export const createFragment = (typeName: string, field: string) => {
  const str = `fragment Fragment on ${typeName} { ${field} }`
  return gql(str);
}
type CrudKeys = {
  key?: string;
  index: number;
}

export const insertInPosition = (object: any[], keys: CrudKeys[], value: Record<string, any>) => {
  const iterator = keys[Symbol.iterator]();

  return modify(object, iterator, value, true);
};

export const updateInPosition = (object: any[], keys: CrudKeys[], value: Record<string, any>) => {
  const iterator = keys[Symbol.iterator]();

  return modify(object, iterator, value, false);
}

const modify = (object: any, keys: Iterator<CrudKeys>, value: Record<string, any>, replace?: boolean): any => {
  const iterator = keys.next();
  const iteratorValue = iterator.value;
  const key = iteratorValue?.key;
  const index = iteratorValue?.index;

  if (!key) {
    if (!replace) {
      if (Array.isArray(object)) {
        return [...object.slice(0, index), {...object[index], ...value}, ...object.slice(index + 1)];
      }
      return {...object, ...value}
    }
    return [...object, value]
  }

  return [...object.slice(0, index), {...object[index], [key]: modify(object[index][key], keys, value, replace)}, ...object.slice(index + 1)]
}
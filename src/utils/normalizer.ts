export const normalizeByKey = <T>(key: string) => {
  return (data: Record<string, T>, item: any) => {
    data[item[key]] = item;
    return data;
  }
}

export const toDropdownOption = <T extends PrimitiveCacheEntity>(data: T[] | undefined, getDisplayName: (it: T) => string): Map<string | number, DropdownOptionType> => {
  return new Map(data?.map(it => [it.id, {value: it.id, text: getDisplayName(it)}]) || []);
}
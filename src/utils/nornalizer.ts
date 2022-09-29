export const normalizeByKey = <T>(key: string) => {
  return (data: Record<string, T>, item: any) => {
    data[item[key]] = item;
    return data;
  }
}
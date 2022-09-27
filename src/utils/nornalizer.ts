export const normalizeByKey = (key: string) => {
  return (data: Record<string, any>, item: any) => {
    data[item[key]] = item;
    return data;
  }
}
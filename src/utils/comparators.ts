// TODO: add real student type
export const compareStudents = (a: any, b: any) => {
  if (a.surname < b.surname) {
    return -1;
  }
  if (a.surname > b.surname) {
    return 1;
  }
  return 0;
};
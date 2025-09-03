export const compareStudents = (a: any, b: any) => {
    if (a.student?.surname < b.student?.surname) {
        return -1;
    }
    if (a.student?.surname > b.student?.surname) {
        return 1;
    }
    return 0;
};

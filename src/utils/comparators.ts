export const compareStudents = (a: TeacherCourseStudent, b: TeacherCourseStudent) => {
  if (a.student.surname < b.student.surname) {
    return -1;
  }
  if (a.student.surname > b.student.surname) {
    return 1;
  }
  return 0;
};

export const compareByClass = (a: TeacherCourseStudent, b: TeacherCourseStudent) => {
  if (a.student.class < b.student.class) return -1;
  if (a.student.class > b.student.class) return 1;
  return 0;
}
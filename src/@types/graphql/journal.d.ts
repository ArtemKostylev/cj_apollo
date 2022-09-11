declare type TeacherCourseStudent = {
  id: number;
  teacher: Teacher;
  course: Course;
  student: Student;
  subgroup?: number;
  journalEntry: JournalEntry[];
  quaterMark: QuarterMark[];
  consult?: Consult[];
  archived?: boolean;
  hours?: number;
}

declare type JournalEntry = {
  id: number;
  mark: string;
  date: string;
  relationId?: number;
  replacement?: Replacement;
}

declare type Replacement = {
  id: number;
  date: string;
};

declare interface QuarterMark extends Omit<JournalEntry, 'date'> {
  period: string;
}

declare type Consult = {
  id: number;
  date: string;
  year: number;
  hours: number;
  relation: TeacherCourseStudent;
}

declare type GroupConsult = {
  id: number;
  date: string;
  year: number;
  class: number;
  subgroup: number;
  teacherId: number;
  courseId: number;
  hours: number;
  program: string;
}
declare interface Student extends PrimitiveCacheEntity {
  name: string;
  surname: string;
  class: number;
  program: string;
  load?: number;
  relations: TeacherCourseStudent[];
  specialization: Specialization;
  freezeVersion?: FreezeVersion;
}

declare type Specialization = {
  id: number;
  name: string;
  students: Student[];
  freezeVersion?: FreezeVersion;
}

declare type Teacher = {
  id: number;
  name?: string;
  surname?: string;
  parent?: string;
  userId?: number;
  relations: TeacherCourseStudent[];
  freezeVersion?: FreezeVersion;
}

declare type Course = {
  id: number;
  name: string;
  group: boolean;
  freezeVersion?: FreezeVersion;

  [key: string]: any;
}

declare type FreezeVersion = {
  id: number;
  year: number;
}

declare interface MidtermExam extends PrimitiveCacheEntity {
  student: Student;
  date: string;
  contents: string;
  result: string;
  type: MidtermExamType;
  number: number;

  [key: string]: any;
}

declare interface MidtermExamType extends PrimitiveCacheEntity {
  name: string;
}
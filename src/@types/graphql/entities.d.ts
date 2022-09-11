declare type Student = {
  id: number;
  name: string;
  surname: string;
  class: number;
  program: string;
  load?: number;
  relations: TeacherCourseStudent[];
  specialization: Specialization;
}

declare type Specialization = {
  id: number;
  name: string;
  students: Student[];
}

declare type Teacher = {
  id: number;
  name?: string;
  surname?: string;
  parent?: string;
  userId?: number;
  relations: TeacherCourseStudent[];
}

declare type Course = {
  id: number;
  name: string;
  group: boolean;

  [key: string]: any;
}
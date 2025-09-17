export interface TeacherForRelations {
    id: number;
    teacherName: string;
}

export interface Teacher {
    id: number;
    name: string;
    surname: string;
    parent: string;
}
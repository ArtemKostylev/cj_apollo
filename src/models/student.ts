export interface StudentForRelations {
    id: number;
    studentName: string;
}

export interface StudentGroupForRelations {
    group: string;
    students: StudentForRelations[];
}

export interface Student {
    id: number;
    name: string;
    surname: string;
    class: number;
    program: string;
    specializationId: number;
}
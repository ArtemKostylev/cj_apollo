export interface StudentForRelations {
    id: number;
    studentName: string;
}

export interface StudentGroupForRelations {
    group: string;
    students: StudentForRelations[];
}

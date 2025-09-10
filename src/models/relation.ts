export interface RelationStudent {
    id: number;
    studentName: string;
    archived: boolean;
}

export interface RelationStudentGroup {
    group: string;
    students: RelationStudent[];
}

export interface RelationCourse {
    courseId: number;
    courseName: string;
    allStudentIds: RelationStudentGroup[];
    archived: boolean;
    studentsById: Record<number, RelationStudent>;
}

export interface Relation {
    teacherId: number;
    teacherName: string;
    courses: Record<number, RelationCourse>;
}

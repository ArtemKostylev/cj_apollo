export interface RelationStudent {
    id: number;
    archived: boolean;
}

export interface RelationCourse {
    courseId: number;
    students: RelationStudent[];
    archived: boolean;
}

export interface Relation {
    teacherId: number;
    coursesById: Record<number, RelationCourse>;
    courses: {
        id: number;
        archived: boolean;
    }[];
}

export interface ChangedRelation {
    teacherId: number;
    courseId: number;
    studentId?: number;
    checked: boolean;
}

import type { DropdownOptionType } from './dropdownOption';

export interface TeacherForRelations {
    id: number;
    teacherName: string;
}

export interface Teacher extends Record<string, unknown> {
    id: number;
    name: string;
    surname: string;
    parent: string;
    user: DropdownOptionType | undefined;
}

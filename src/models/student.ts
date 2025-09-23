import type { DropdownOptionType } from './dropdownOption';

export interface StudentForRelations {
    id: number;
    name: string;
}

export interface StudentGroupForRelations {
    group: string;
    students: StudentForRelations[];
}

export interface StudentFilter {
    name: string | undefined;
    surname: string | undefined;
    class: string | undefined;
    program: string | undefined;
    specialization: string | undefined;
}

export interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    surname: string;
    class: number;
    program: string;
    specialization: DropdownOptionType;
}

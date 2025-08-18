import type { Quarters } from '~/constants/date';

export interface Mark {
    id: number | undefined;
    mark: string;
    date: string;
}

export interface QuarterMark {
    id: number | undefined;
    period: Quarters;
    year: number;
    mark: string;
}

export interface JournalRow {
    relationId: number;
    studentName: string;
    class: string;
    archived: boolean;
    marks: Record<string, Mark>;
    quarterMarks: Record<Quarters, QuarterMark>;
}

export interface ChangedMark {
    id: number;
    mark: string;
    date: string;
    relationId: number;
}

export interface ChangedQuarterMark {
    id: number;
    period: Quarters;
    year: number;
    mark: string;
    relationId: number;
}

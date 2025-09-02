export interface Replacement {
    id: number | undefined;
    date: string | undefined;
    journalEntryId: number;
    journalEntryDate: string;
}

export interface ReplacementRow {
    relationId: number;
    archived: boolean;
    studentName: string;
    studentClass: string;
    replacements: Record<number, Replacement>;
}

export interface ReplacementTable {
    rows: ReplacementRow[];
}

export interface ChangedReplacement {
    id: number;
    date: string;
    journalEntryId: number;
}

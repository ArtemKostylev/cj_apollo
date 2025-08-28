import type { Quarters } from '~/constants/date';
import type { Mark } from './mark';
import type { QuarterMark } from './quarterMark';

export interface GroupJournalTable {
    group: string;
    dates: Record<string, string[]>;
    rows: Record<number, GroupJournalRow>;
}

export interface GroupJournalRow {
    relationId: number;
    studentName: string;
    archived: boolean;
    marks: Record<string, Mark>;
    quarterMarks: Record<Quarters, QuarterMark>;
}

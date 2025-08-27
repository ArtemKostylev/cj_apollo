import type { Quarters } from "~/constants/date";
import type { Mark } from "./mark";
import type { QuarterMark } from "./quarterMark";

export interface JournalRow {
    relationId: number;
    studentName: string;
    class: string;
    archived: boolean;
    marks: Record<string, Mark>;
    quarterMarks: Record<Quarters, QuarterMark>;
}
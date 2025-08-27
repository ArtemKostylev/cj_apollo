import type { Quarters } from "~/constants/date";

export interface QuarterMark {
    id: number | undefined;
    period: Quarters;
    year: number;
    mark: string;
}

export interface ChangedQuarterMark {
    id: number;
    period: Quarters;
    year: number;
    mark: string;
    relationId: number;
}
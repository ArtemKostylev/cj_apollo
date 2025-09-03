export interface ChangedConsult {
    id: number;
    date: string;
    hours: number | undefined;
    relationId?: number | undefined;
    class?: number | undefined;
    program?: string | undefined;
    subgroup?: number | undefined;
    year: number;
}

export interface OffsetResponse<T> {
    rows: T[];
    nextOffset: number | undefined;
}

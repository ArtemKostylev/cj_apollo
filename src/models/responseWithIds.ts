export interface ResponseWithIds<T> {
    data: Record<number, T>;
    ids: number[];
}

export interface Mark {
    id: number | undefined;
    mark: string;
    date: string;
}

export interface ChangedMark {
    id: number;
    mark: string;
    date: string;
    relationId: number;
}
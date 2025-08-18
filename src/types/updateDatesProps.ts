import type { Moment } from 'moment';

export type UpdateDatesProps = {
    date: Moment;
    hours?: number;
    column: number;
    row: number;
    predicate?: (value: any) => boolean;
};

import type { Quarters } from '~/constants/date';
import type { Mark } from './mark';
import type { QuarterMark } from './quarterMark';

export interface GroupJournalTable {
    group: string;
    dates: Record<string, string[]>;
    rows: Record<number, GroupJournalRow>;
}

/* 
    We have an initial structure, created by server, which contains dates in months sorted by asc.

    It looks like this:
    {
        "05": [
            "2025-05-01",
            "2025-05-02",
            "2025-05-03",
            "",
            ""
        ]
    }

    To achieve said structure, we select distinct dates from db inside selected period. Then we sort them by asc.
    Dates can be turned into iterator.
    We peek inside next item. If months are different, we add empty string for empty cells. Then move on to next month.

    When user changes date, we want to do:
    1. If there are marks with that date, update them
    2. If there no marks with that date, we want to assign this date to columnId it is in

    columnId is a month number + index. Like "01050" for May, 0th index. They are calculated on render.
    We take first 2 symbols are group index. Then we take next 2 symbols as month code. Find array of dates by it. Then we take last symbol and use it as index.

    This way, operation 2 is O(1).

    Gladly, rows are objects, with date as key. So, when operation 1 is performed, we can do following steps:
    1. Check if we have a mark with old date in row.
    2. If true, we insert this mark to new date key.
    3. Update date inside it.
    4. Delete mark with old date.
    5. Add new mark to updated array.

    This way, operation 1 is O(n).

    Date can't be deleted.
    Dates are locked to month they belong to.

    We need to store all changes in memory and send them to server in one request.
*/

export interface GroupJournalRow {
    relationId: number;
    studentName: string;
    archived: boolean;
    marks: Record<string, Mark>;
    quarterMarks: Record<Quarters, QuarterMark>;
}

import { SelectCell } from '~/components/cells/selectCell1';
import type { ChangedMark, Mark } from '~/models/mark';
import { useCallback } from 'react';
import { HOURS_OPTIONS, MARKS_OPTIONS } from '~/constants/selectCellOptions';
import { getDay } from 'date-fns';
import { format } from 'date-fns';
import { DATE_FORMAT, WEEKEND_DAY } from '~/constants/date';

interface Props {
    mark: Mark | undefined;
    date: Date;
    relationId: number;
    onlyHours: boolean;
    archived: boolean;
    onChange: (columnId: string, mark: ChangedMark) => void;
    readonly: boolean;
}

export const MarkCell = (props: Props) => {
    const { mark, date, relationId, onlyHours, archived, onChange, readonly } = props;

    const options = onlyHours ? HOURS_OPTIONS : MARKS_OPTIONS;
    const isWeekend = getDay(date) === WEEKEND_DAY;

    const onSelect = useCallback(
        (value: string | number) => {
            const columnId = `${relationId}-${format(date, DATE_FORMAT)}`;
            onChange(columnId, {
                id: mark?.id || 0,
                mark: value as string,
                date: format(date, DATE_FORMAT),
                relationId: relationId
            });
        },
        [onChange]
    );

    return (
        <SelectCell
            value={mark?.mark}
            options={options}
            onSelect={onSelect}
            isWeekend={isWeekend}
            disabled={archived}
        />
    );
};

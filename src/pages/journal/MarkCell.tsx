import { SelectCell } from '~/components/cells/SelectCell';
import type { ChangedMark, Mark } from '~/models/mark';
import { useCallback } from 'react';
import type { Moment } from 'moment';
import { HOURS_OPTIONS, MARKS_OPTIONS } from '~/constants/selectCellOptions';

interface Props {
    mark: Mark;
    date: Moment;
    relationId: number;
    onlyHours: boolean;
    archived: boolean;
    onChange: (columnId: string, mark: ChangedMark) => void;
}

export const MarkCell = (props: Props) => {
    const { mark, date, relationId, onlyHours, archived, onChange } = props;

    const options = onlyHours ? HOURS_OPTIONS : MARKS_OPTIONS;
    const isWeekend = date.isoWeekday() === 6;

    const onSelect = useCallback(
        (value: string | number) => {
            const columnId = `${relationId}-${date.format('YYYY-MM-DD')}`;
            onChange(columnId, {
                id: mark.id || 0,
                mark: value as string,
                date: date.format('YYYY-MM-DD'),
                relationId: relationId
            });
        },
        [onChange]
    );

    return (
        <SelectCell
            value={mark.mark}
            options={options}
            onSelect={onSelect}
            isWeekend={isWeekend}
            disabled={archived}
        />
    );
};

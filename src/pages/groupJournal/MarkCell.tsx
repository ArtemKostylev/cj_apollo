import { memo, useCallback } from 'react';
import { SelectCell } from '~/components/cells/SelectCell';
import { getMarkColumnId } from './utils';

interface Props {
    tableIndex: string;
    month: string;
    selectOptions: DropdownOptionType[];
    rowIndex: number;
    date: string;
    dateIndex: number;
    relationId: number;
    mark: string | undefined;
    archived: boolean;
    onMarkChange: (columnId: string, value: string) => void;
}

export const MarkCell = memo((props: Props) => {
    const {
        selectOptions,
        rowIndex,
        date,
        dateIndex,
        relationId,
        mark,
        tableIndex,
        month,
        onMarkChange: onMarkChangeProp,
        archived
    } = props;

    const onMarkChange = useCallback(
        (value: string) => {
            onMarkChangeProp(
                getMarkColumnId({
                    tableIndex,
                    month,
                    index: dateIndex,
                    relationId
                }),
                value
            );
        },
        [onMarkChangeProp]
    );

    return (
        <SelectCell
            options={selectOptions}
            key={`${rowIndex}-${date}-${dateIndex}`}
            value={mark}
            onSelect={onMarkChange}
            disabled={archived}
        />
    );
});

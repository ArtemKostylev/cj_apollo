import type { Quarters } from '~/constants/date';
import type { ChangedQuarterMark, QuarterMark } from '~/models/quarterMark';
import { MARKS_OPTIONS } from '~/constants/selectCellOptions';
import { useCallback } from 'react';
import { SelectCell } from '~/components/cells/selectCell';

interface Props {
    mark: QuarterMark | undefined;
    period: Quarters;
    year: number;
    relationId: number;
    archived: boolean;
    onChange: (clientId: string, quarterMark: ChangedQuarterMark) => void;
    readonly: boolean;
}

export const QuarterMarkCell = (props: Props) => {
    const { mark, period, year, relationId, archived, onChange, readonly } = props;

    const options = MARKS_OPTIONS;

    const onSelect = useCallback(
        (value: string | number) => {
            const clientId = `${relationId}-${period}`;
            onChange(clientId, {
                id: mark?.id || 0,
                mark: value as string,
                period,
                year,
                relationId
            });
        },
        [onChange]
    );

    return (
        <SelectCell value={mark?.mark} options={options} onSelect={onSelect} disabled={archived} readonly={readonly} />
    );
};

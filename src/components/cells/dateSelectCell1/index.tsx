import { useState, useCallback, ChangeEvent } from 'react';
import { DateCell } from '~/components/cells/dateCell';
import { TableCell } from '~/components/cells/tableCell1';
import type { ChangedConsult } from '~/models/consult';
import type { AcademicYears } from '~/constants/date';
import { SelectCell } from '../selectCell1';

type Props = {
    columnId: string;
    relationId?: number;
    consultId?: number;
    class?: number;
    program?: string;
    subgroup?: number;
    year: AcademicYears;
    date: string | undefined;
    hours: number | undefined;
    onChange: (columnId: string, updatedConsult: ChangedConsult) => void;
    onDisabledClick?: () => void;
    readonly?: boolean;
};

const HOURS = [0, 1, 1.5, 2, 2.5, 3].map((it) => ({
    value: it.toString(),
    text: it.toString()
}));

export const DateSelectCell = (props: Props) => {
    const {
        columnId,
        relationId,
        consultId,
        year,
        date,
        hours,
        onChange,
        class: classProp,
        program,
        subgroup,
        onDisabledClick,
        readonly
    } = props;
    const [hoursValue, setHoursValue] = useState(hours || 0);
    const [dateValue, setDateValue] = useState(date);

    const onDateChange = useCallback(
        (columnId: string, value: string) => {
            setDateValue(value);

            const newData: ChangedConsult = {
                id: consultId ?? 0,
                date: value,
                hours: hoursValue,
                year
            };

            if (relationId) {
                newData.relationId = relationId;
            } else {
                newData.class = classProp;
                newData.program = program;
                newData.subgroup = subgroup;
            }

            onChange(columnId, newData);
        },
        [columnId, hoursValue, onChange]
    );

    const onHoursChange = useCallback(
        (selectValue: string) => {
            const value = parseFloat(selectValue);
            setHoursValue(value);

            if (!dateValue) {
                throw new Error('Date value is required');
            }

            const newData: ChangedConsult = {
                id: consultId ?? 0,
                date: dateValue,
                hours: value,
                year
            };

            if (relationId) {
                newData.relationId = relationId;
            } else {
                newData.class = classProp;
                newData.program = program;
                newData.subgroup = subgroup;
            }

            onChange(columnId, newData);
        },
        [columnId, consultId, dateValue, relationId, year, onChange]
    );

    return (
        <>
            <TableCell style={{ width: '50px' }}>
                <DateCell
                    columnId={columnId}
                    initialValue={dateValue}
                    onChange={onDateChange}
                    year={year}
                    readonly={readonly}
                />
            </TableCell>
            <SelectCell
                style={{ width: '50px' }}
                value={hoursValue?.toString()}
                onSelect={onHoursChange}
                options={HOURS}
                disabled={!dateValue}
                onDisabledClick={onDisabledClick}
                readonly={readonly}
            />
        </>
    );
};

import { useState, useCallback, ChangeEvent, useMemo } from 'react';
import { DateCell } from '~/components/cells/dateCell';
import { HOURS } from '~/constants/hours';
import { TableCell } from '~/components/cells/TableCell';

export interface UpdatedConsult {
    clientId: string;
    id: number | undefined;
    date: string | undefined;
    hours: number | undefined;
    class?: number;
    program?: string;
    subgroup?: number;
    relationId?: number;
    year: number;
}

type Props = {
    clientId: string;
    relationId?: number;
    consultId: number | undefined;
    year: number;
    date: string | undefined;
    hours: number | undefined;
    program?: string;
    subgroup?: number;
    class?: number;
    onChange: (updatedConsult: UpdatedConsult) => void;
};

export const ConsultCell = (props: Props) => {
    const { clientId, relationId, consultId, year, date, hours, onChange, program, class: classProp, subgroup } = props;
    const [hoursValue, setHoursValue] = useState(hours);
    const [dateValue, setDateValue] = useState(date);

    const initialDateValue = useMemo(() => (date ? moment(date) : undefined), [date]);

    const onDateChange = useCallback(
        ({ date }: { date: Moment }) => {
            setDateValue(date.toISOString());

            const newData: UpdatedConsult = {
                clientId,
                id: consultId,
                date: date.toISOString(),
                hours: hoursValue,
                year
            };

            if (relationId) {
                newData.relationId = relationId;
            } else {
                newData.program = program;
                newData.class = classProp;
                newData.subgroup = subgroup;
            }

            onChange(newData);
        },
        [clientId, hoursValue, onChange]
    );

    const onHoursChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            const value = parseFloat(event.target.value);
            setHoursValue(value);

            const newData: UpdatedConsult = {
                clientId,
                id: consultId,
                date: dateValue,
                hours: value,
                year
            };

            if (relationId) {
                newData.relationId = relationId;
            } else {
                newData.program = program;
                newData.class = classProp;
                newData.subgroup = subgroup;
            }

            onChange(newData);
        },
        [clientId, consultId, dateValue, relationId, year, onChange]
    );

    return (
        <>
            <TableCell>
                <DateCell
                    month={moment().month()}
                    initialValue={initialDateValue}
                    updateDates={onDateChange}
                    unlimited
                />
            </TableCell>
            <TableCell>
                <select value={hoursValue} onChange={onHoursChange}>
                    {HOURS.map((it) => (
                        <option value={it} key={it}>
                            {it}
                        </option>
                    ))}
                </select>
            </TableCell>
        </>
    );
};

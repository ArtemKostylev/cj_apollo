import React, {useState, useEffect} from 'react';
import EditableDateCell from '../../../shared/ui/EditableDateCell';

const HourDateCell = ({column, hours, date, row, updateDates, unlimited}) => {
    const [hoursValue, setHoursValue] = useState(hours);

    useEffect(() => {
        setHoursValue(hours);
    }, [hours, setHoursValue]);

    return (
        <React.Fragment>
            <td>
                <EditableDateCell
                    initialValue={date || ''}
                    column={column || 0}
                    row={row || 0}
                    updateDates={updateDates}
                    unlimited
                    style={{width: '100%'}}
                />
            </td>
            <td>
                <select
                    value={hoursValue}
                    onChange={(event) => {
                        setHoursValue(event.target.value);
                        updateDates({
                            date: date,
                            hours: parseFloat(event.target.value),
                            column: column,
                            row: row,
                        });
                    }}
                >
                    <option value='0'></option>
                    <option value='1'>1</option>
                    <option value='1.5'>1.5</option>
                    <option value='2'>2</option>
                    <option value='2.5'>2.5</option>
                    <option value='3'>3</option>
                </select>
            </td>
        </React.Fragment>
    );
};
export default HourDateCell;

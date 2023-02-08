import React, {memo} from 'react';
import {CellInput} from './style/CellInput.styled';
import {TableCell} from '../styles/TableCell.styled';

export const InputCell = memo(({value, onChange, error, options}: TableItemProps) => {
  const rows = options?.rows;

  return (
    <TableCell error={error}>
      <CellInput value={value} onChange={e => onChange(e.target.value)} rows={rows}/>
    </TableCell>
  )
});

import React from 'react';
import {CellInput} from './style/CellInput.styled';
import {TableCell} from '../TableCell.styled';

type Props = {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export const InputCell = ({value, onChange, rows}: Props) => {
  return (
    <TableCell>
      <CellInput value={value} onChange={e => onChange(e.target.value)} rows={rows}/>
    </TableCell>
  )
}
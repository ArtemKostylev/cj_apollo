import React from 'react';
import {CellInput} from './style/CellInput.styled';
import {TableCell} from '../styles/TableCell.styled';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  rows?: number;
  error?: boolean;
}

export const InputCell = ({value, onChange, rows, error, onBlur}: Props) => {
  return (
    <TableCell error={error}>
      <CellInput value={value} onChange={e => onChange(e.target.value)} rows={rows} onBlur={onBlur}/>
    </TableCell>
  )
}
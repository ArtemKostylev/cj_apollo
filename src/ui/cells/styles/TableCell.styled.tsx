import styled, {css} from 'styled-components';
import {errorStyles} from './error';
import {forwardRef, MouseEventHandler} from 'react';
import {theme} from '../../../styles/theme';

interface TableCellProps extends PrimitiveComponentProps {
  disabled?: boolean,
  error?: boolean,
  onClick?: MouseEventHandler<HTMLDivElement> & ((e: HTMLDivElement) => void);
  isWeekend?: boolean;
}

const TableCellOuter = styled.td<TableCellProps>`
  border: 1px solid #e6eaea;
  position: relative;
  padding: 0;
  height: inherit;

  ${({isWeekend}) => isWeekend && css`
    background-color: #eff0f0;
    border-color: ${theme.thBorder};
  `};

  ${({onClick}) => onClick && css`
    cursor: pointer;
    
    &:hover {
      background-color: #e6eaea;
    }`
  };

  ${({error}) => error && errorStyles}

  ${({disabled}) => disabled && 'background-color: #e6eaea'};
`

const TableCellInner = styled.div`
  height: 100%;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
`

const TableCellText = styled.span`
  height: fit-content;
  width: 100%;
  line-height: 1.5rem;
  text-align: center;
`

export const TableCell = forwardRef<any, TableCellProps>(({disabled, error, onClick, children, isWeekend}, ref,) => {
  return (<TableCellOuter disabled={disabled} error={error} ref={ref} onClick={onClick} isWeekend={isWeekend}>
    <TableCellInner>
      <TableCellText>
        {children}
      </TableCellText>
    </TableCellInner>
  </TableCellOuter>)
});
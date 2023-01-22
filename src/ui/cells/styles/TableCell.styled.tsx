import styled from 'styled-components';
import {errorStyles} from './error';

export const TableCell = styled.td<{ disabled?: boolean, error?: boolean }>`
  border: 1px solid #e6eaea;
  padding: 0;
  cursor: pointer;
  line-height: 6vh;
  position: relative;
  width: fit-content;

  ${({error}) => error && errorStyles}

  ${({disabled}) => disabled && 'background-color: #e6eaea'};

`
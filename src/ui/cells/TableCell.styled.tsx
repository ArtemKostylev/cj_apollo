import styled from 'styled-components';

export const TableCell = styled.td<{ disabled?: boolean }>`
  border: 1px solid #e6eaea;
  border-top: none;
  border-collapse: collapse;
  padding: 0;
  cursor: pointer;
  line-height: 6vh;
  position: relative;
  width: fit-content;

  ${({disabled}) => disabled && 'background-color: #e6eaea'};

`
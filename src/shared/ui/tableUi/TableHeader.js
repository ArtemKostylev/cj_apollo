import React from 'react';
import styled from 'styled-components';

const TableHeaderBase = styled.th`
  line-height: 6vh;
  empty-cells: show;
  border-top: none;
  border: 1px solid #d6d8d8;
  border-collapse: collapse;
  background-color: #eff0f0;
`;

export const TableHeader = ({ text, colSpan = '1', rowSpan = '1' }) => (
  <TableHeaderBase colSpan={colSpan} rowSpan={rowSpan}>
    {text}
  </TableHeaderBase>
);

import React from 'react';
import styled from 'styled-components';

const TableBase = styled.table`
  border-top: none;
  border-collapse: collapse;
  min-height: 100px;
  width: 100%;
  overflow: hidden;
  line-height: 0.9vw;
  empty-cells: show;
`;

export const Table = ({ children }) => {
  return (
    <TableBase>
      <tbody>{children}</tbody>
    </TableBase>
  );
};

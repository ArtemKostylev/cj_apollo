import styled from 'styled-components';

export const TableWrapper = styled.table<{ fixed?: boolean }>`
  border-top: none;
  border-collapse: collapse;
  min-height: 100px;
  width: 100%;
  line-height: 0.9vw;
  empty-cells: show;
  table-layout: ${props => props.fixed ? 'fixed' : 'auto'};
`;
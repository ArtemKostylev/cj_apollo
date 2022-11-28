import React, {memo} from 'react';
import {TableWrapper} from './style/TableWrapper.styled';

type Props = PrimitiveComponentProps & {
  fixed?: boolean;
}

export const Table = memo(({children, fixed}: Props) => (
  <TableWrapper fixed={fixed}>
    {children}
  </TableWrapper>
))
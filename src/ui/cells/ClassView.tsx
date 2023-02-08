import {memo} from 'react';
import {NameCellBase} from './NameView';
import styled from 'styled-components';

const Base = styled(NameCellBase)`
  text-align: center;
  width: fit-content;
`

export const ClassView = memo(({value, disabled}: Partial<TableItemProps>) => {
  return (
    <Base archived={disabled}>
      {value}
    </Base>
  )
});
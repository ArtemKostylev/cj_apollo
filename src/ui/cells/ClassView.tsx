import React, {memo} from 'react';
import {NameCellBase} from './NameView';
import {PROGRAMS} from '../../constants/programs';
import styled from 'styled-components';

type Props = {
  classNum: number | undefined;
  program: string | undefined;
  archived?: boolean;
}

const Base = styled(NameCellBase)`
  text-align: center;
  width: fit-content;
`

export const ClassView = memo(({classNum, program, archived}: Props) => {
  return (
    <Base archived={archived}>
      {`${classNum || ''}${program ? PROGRAMS[program] : ''} ${archived ? '(A)' : ''}`}
    </Base>
  )
});
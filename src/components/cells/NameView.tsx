import React, {memo} from 'react';
import styled from 'styled-components';
import {theme} from '../../styles/theme';

export const NameCellBase = styled.td<{ archived?: boolean }>`
  cursor: default;
  text-align: center;
  color: ${props => props.archived ? 'gray' : 'black'};
  line-height: 6vh;
  border: 1px solid ${theme.border};
`;

type Props = {
  name: string;
  surname: string;
  archived?: boolean;
}

export const NameView = memo(({name, surname, archived}: Props) => {
  return (
    <NameCellBase archived={archived}>
      {
        `${surname} ${name} ${archived ? '(A)' : ''}`
      }
    </NameCellBase>
  )
})
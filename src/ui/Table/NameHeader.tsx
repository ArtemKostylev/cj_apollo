import React from 'react';
import styled from 'styled-components';
import {Header} from './style/Header.styled';

const NameHeaderWrapper = styled(Header)`
  width: 15rem;
`;

type Props = {
  rowSpan?: number;
}

export const NameHeader = ({rowSpan}: Props) => (
  <NameHeaderWrapper rowSpan={rowSpan}>Имя ученика</NameHeaderWrapper>
)
import React from 'react';
import styled from 'styled-components';
import {Header} from './style/Header.styled';

const NameHeaderWrapper = styled(Header)`
  width: 15rem;
`;

export const NameHeader = ({rowSpan, width}: HeaderProps) => (
  <NameHeaderWrapper rowSpan={rowSpan} width={width}>Имя ученика</NameHeaderWrapper>
)
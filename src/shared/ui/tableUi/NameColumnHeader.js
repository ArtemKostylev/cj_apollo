import React from 'react';
import styled from 'styled-components';

const NameColumnHeaderBase = styled.th`
  width: 15rem;
  border: none;
`;

export const NameColumnHeader = ({ text }) => (
  <NameColumnHeaderBase rowSpan='2'>{text}</NameColumnHeaderBase>
);

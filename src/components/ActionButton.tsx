import styled from 'styled-components';

export const ActionButton = styled.button`
  border: 0;
  border-right: 1px solid ${({ theme }) => theme.border};
  width: 10vw;
  line-height: 40px;
  max-width: 10vw;
  outline: none;
  background: transparent;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
    cursor: pointer;
  }
`;

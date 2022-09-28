import React from 'react';
import styled from 'styled-components';

interface Props extends PrimitiveComponentProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const ButtonBase = styled.button`
  cursor: pointer;
  width: fit-content;
  padding: 0 20px;
  outline: none;
  font-size: 1.3rem;
  border: none;
  line-height: 3rem;

  &:hover {
    background-color: #ddd;
  }
`;

export const Button = ({children, onClick, type, className}: Props) => (
  <ButtonBase onClick={onClick} type={type} className={className}>
    {children}
  </ButtonBase>
);

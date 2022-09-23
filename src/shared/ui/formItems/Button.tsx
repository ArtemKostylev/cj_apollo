import React from 'react';
import styled from 'styled-components';

export type ButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
}

const BottonBase = styled.button`
  border: 0;
  background-color: transparent;
  padding: 1em;
  cursor: pointer;

  &:hover {
    background-color: #e6eaea;
  }

  &:focus {
    outline: 0;
  }
`

export const Button = ({disabled, label, onClick}: ButtonProps) => {
  return (
    <BottonBase disabled={disabled} onClick={onClick}>
      {label}
    </BottonBase>
  );
};
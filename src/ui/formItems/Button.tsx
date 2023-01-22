import React from 'react';
import styled from 'styled-components';
import {ControlContainer} from './style/ControlContainer.styled';

export type ButtonProps = {
  disabled?: boolean;
  onClick?: (param: any) => void;
  text?: string;
}

export const ButtonBase = styled.button`
  border: 0;
  background-color: transparent;
  padding: 1em;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #e6eaea;
  }

  &:focus {
    outline: 0;
  }
`

export const Button = ({disabled, text, onClick}: ButtonProps) => {
  return (
    <ControlContainer>
      <ButtonBase disabled={disabled} onClick={onClick}>
        {text}
      </ButtonBase>
    </ControlContainer>
  );
};
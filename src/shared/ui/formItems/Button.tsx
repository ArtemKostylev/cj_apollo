import React from 'react';
import styled from 'styled-components';
import {ControlContainer} from './ControlContainer.styled';
import {theme} from '../../../styles/theme';

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
  border-right: 1px solid ${theme.border};

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
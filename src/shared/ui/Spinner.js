import styled, {keyframes} from 'styled-components';
import React from 'react';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.div`
  position: absolute;
  top: 48%;
  left: 48%;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border: 4px solid #f0f0f0;
  border-bottom: 4px solid #818181;
  animation: ${spin} 1s infinite linear;
`
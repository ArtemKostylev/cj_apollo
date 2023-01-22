import styled from 'styled-components';
import {errorStyles} from '../../styles/error';

export const CellInput = styled.textarea<{ error?: boolean }>`
  border: none;
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100% - 4px);
  outline: none;
  text-align: center;
  margin: 2px;
  width: calc(100% - 4px);
  background-color: transparent;


  ${({error}) => error && errorStyles}
`;
import styled from 'styled-components';
import {theme} from '../../../styles/theme';

export const ControlContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 10vw;
  position: relative;
  border-right: 1px solid ${theme.border};

  div {
    width: inherit;
  }
`
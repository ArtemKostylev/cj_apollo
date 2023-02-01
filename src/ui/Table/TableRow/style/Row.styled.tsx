import styled from 'styled-components';
import {theme} from '../../../../styles/theme';

export const Row = styled.tr<{ selected: boolean }>`
  height: 10em;
  background-color: ${props => props.selected ? theme.darkBg : 'none'};

  td {
    border-color: ${theme.thBorder};
  }
`;
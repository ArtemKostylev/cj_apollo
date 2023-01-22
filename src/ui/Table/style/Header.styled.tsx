import styled, {css} from 'styled-components';
import {theme} from '../../../styles/theme';

export const Header = styled.th<{ hoverable?: boolean, width?: number }>`
  line-height: 6vh;
  empty-cells: show;
  border: 1px solid ${theme.thBorder};
  border-top: none;
  border-collapse: collapse;
  background-color: #eff0f0;
  width: ${props => props.width ? `${props.width}px` : 'auto'};

  ${props => props.hoverable && css`
    &:hover {
      background-color: #e6eaea;
    }
  `}
`;
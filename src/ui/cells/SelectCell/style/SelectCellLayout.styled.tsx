import styled, {css} from 'styled-components';
import {theme} from '../../../../styles/theme';
import {TableCell} from '../../styles/TableCell.styled';

export const SelectCellLayout = styled(TableCell)<{ isWeekend: boolean | undefined }>`

  ${({isWeekend}) => isWeekend && css`
    background-color: #eff0f0;
    border-color: ${theme.thBorder};
  `};

  &:hover {
    background-color: #e6eaea;
  }
`;

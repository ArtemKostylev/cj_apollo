import styled from 'styled-components';

export const EditableCellLayout = styled.td<{ disabled: boolean, isWeekend: boolean }>`
  border: 1px solid #e6eaea;
  border-top: none;
  border-collapse: collapse;
  padding: 0;
  cursor: pointer;
  line-height: 6vh;

  ${({disabled}) => disabled && 'background-color: #e6eaea'};

  ${({isWeekend}) => isWeekend && 'background-color: #eff0f0'};

  &:hover {
    background-color: #e6eaea;
  }
`;

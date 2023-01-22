import styled from 'styled-components';

export const DropdownOption = styled.span<{ short?: boolean }>`
  display: inline-block;
  grid-column: span ${({short}) => (short ? '1' : '2')};
  line-height: 2rem;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  padding: 5px 0;

  &:hover {
    background-color: #ddd;
  }
`;

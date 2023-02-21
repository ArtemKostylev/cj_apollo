import styled from 'styled-components';

export const DropdownOption = styled.span<{ short?: boolean }>`
  display: inline-block;
  grid-column: span ${({short}) => (short ? '1' : '2')};
  line-height: 1.4rem;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  padding: 10px 5px;
  border-bottom: 1px solid #ddd;

  &:hover {
    background-color: #ddd;
  }
`;

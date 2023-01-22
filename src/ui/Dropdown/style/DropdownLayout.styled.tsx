import styled from 'styled-components';

type DropdownLayoutProps = {
  open: boolean;
  width: string;
  inverted: boolean;
}

export const DropdownLayout = styled.div<DropdownLayoutProps>`
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  display: ${({open}) => (open ? 'grid' : 'none')};
  width: ${({width}) => `${width}px`};
  box-shadow: rgba(0, 0, 0, 0.19) 0 10px 20px, rgba(0, 0, 0, 0.23) 0 6px 6px;
  position: absolute;
  top: 100%;
  left: 0;
  height: fit-content;
  overflow: visible;
  margin: 0;
  z-index: 10;
  background-color: #f1f1f1;
  ${({inverted}) => inverted && 'transform: translateY(-100%)'};
`;
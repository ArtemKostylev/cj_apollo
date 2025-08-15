import styled from 'styled-components';

export const Cover = styled.div<{ menuVisible: boolean }>`
  display: block;
  z-index: 50;
  visibility: ${props => props.menuVisible ? 'visible' : 'hidden'};
  width: 100vw;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  background-color: black;
  opacity: 50%;
  transform: translateX(${props => props.menuVisible ? '20vw' : '0vw'});
  transition: all 0.5s;
`
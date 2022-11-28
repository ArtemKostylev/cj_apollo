import styled from 'styled-components';

export const Content = styled.div<{ menuVisible: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  transform: translateX(${props => props.menuVisible ? '20vw' : '0vw'});
  transition: transform 0.5s;
  height: 100%;
`;
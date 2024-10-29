import styled from 'styled-components';
// TODO: add styles, and proper animation
export const Spinner = styled.div`
  border-width: 8px;
  border-style: solid;
  border-color: white white white transparent;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  animation: spin 1.5s infinite;
  position: relative;

  margin: 6em auto;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const BlockingSpinnerBase = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(0, 0, 0, 50%);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export const BlockingSpinner = () => (
    <BlockingSpinnerBase>
        <Spinner/>
    </BlockingSpinnerBase>
)
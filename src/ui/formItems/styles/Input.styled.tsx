import styled from 'styled-components';

export const Input = styled.input`
  text-indent: 5px;
  line-height: 3rem;
  font-size: 1.3rem;
  outline: none;
  border: none;
  width: 70%;
  min-width: 400px;
  background-color: #e6eaea;

  &:-webkit-autofill::first-line {
    font-size: 1.3rem;
  }
`;
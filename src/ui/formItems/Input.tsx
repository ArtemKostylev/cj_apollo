import styled from 'styled-components';
import {FormItemWrapper} from './FormItemWrapper';
import {Label} from './Label';
import {BaseFormItemProps} from './types';

interface InputProps extends BaseFormItemProps {
  type?: string;
  children?: any;
}

const InputComponent = styled.input`
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

export const Input = ({name, value, onChange, label, type = 'text', children, required}: InputProps) => (
  <FormItemWrapper>
    <Label htmlFor={name}>{label}:</Label>
    <InputComponent name={name} type={type} id={name} value={value} onChange={e => onChange(name, e.target.value)} required={required}>
      {children}
    </InputComponent>
  </FormItemWrapper>
)
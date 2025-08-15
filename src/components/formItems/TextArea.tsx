import {BaseFormItemProps} from './types';
import {FormItemWrapper} from './FormItemWrapper';
import {Label} from './Label';
import styled from 'styled-components';

interface TextAreaProps extends BaseFormItemProps {
  rows?: number;
}

const TextAreaStyled = styled.textarea`
  line-height: 2rem;
  font-size: 1.3rem;
  outline: none;
  border: none;
  width: 70%;
  min-width: 400px;
  background-color: #e6eaea;
  height: 100% !important;
`

export const TextArea = ({name, label, value, onChange, rows, required}: TextAreaProps) => (
  <FormItemWrapper>
    <Label htmlFor={name}>{label}</Label>
    <TextAreaStyled name={name} value={value} onChange={e => onChange(name, e.target.value)} rows={rows} id={name} required={required}/>
  </FormItemWrapper>
)
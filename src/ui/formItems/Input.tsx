import { FormItemProps } from './types';
import * as S from './styles';

interface InputProps extends FormItemProps<string> {
  pattern?: string;
}

export function Input(props: InputProps) {
  const { name, defaultValue, label, required, pattern } = props;

  return (
    <S.FormItem>
      <S.Label htmlFor={name}>{label}:</S.Label>
      <S.Input name={name} type='text' defaultValue={defaultValue} required={required} pattern={pattern} />
    </S.FormItem>
  )
}
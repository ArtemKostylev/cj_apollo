import { FormItemProps } from './types';
import * as S from './styles';

interface TextAreaProps extends FormItemProps<string> {
  rows?: number;
}

export function TextArea(props: TextAreaProps) {
  const { name, label, defaultValue, rows, required } = props;

  return (
    <S.FormItem>
      <S.Label htmlFor={name}>{label}</S.Label>
      <S.TextArea name={name} rows={rows} required={required} defaultValue={defaultValue} />
    </S.FormItem>
  )
}
import { FormItemProps } from './types';
import { Label } from './styles/Label.styled';
import * as S from './styles';

interface FormSelectProps extends FormItemProps<string | number> {
  options: Map<string | number, DropdownOptionType>;
}

export function Select(props: FormSelectProps) {
  const { name, defaultValue = " ", label, options, required } = props;

  return (
    <S.FormItem>
      <Label htmlFor={name}>{label}:</Label>
      <S.Select id={name} name={name} defaultValue={defaultValue} required={required}>
        <option value=" ">Выберите значение</option>
        {Array.from(options?.values() || []).map(it => <option key={it.value} value={it.value}>{it.text}</option>)}
      </S.Select>
    </S.FormItem>
  )
}
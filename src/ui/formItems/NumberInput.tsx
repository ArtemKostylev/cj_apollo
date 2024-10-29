import { FormItemProps } from './types';
import * as S from './styles';

interface NumberProps extends FormItemProps<number> {
    max?: number;
    min?: number;
}

export function NumberInput(props: NumberProps) {
    const { name, defaultValue, label, required, min, max } = props;

    return (
      <S.FormItem>
        <S.Label htmlFor={name}>{label}:</S.Label>
        <S.NumberInput name={name} type='text' defaultValue={defaultValue} required={required} min={min} max={max}/>
      </S.FormItem>
    )
}
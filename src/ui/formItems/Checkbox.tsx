import { FormItemProps } from './types';
import * as S from './styles';

export function Checkbox(props: FormItemProps<boolean>) {
    const { label, name, defaultValue } = props;

    return (
        <S.FormItem>
            <S.Label htmlFor={name}>{label}</S.Label>
            <S.Checkbox name={name} type='checkbox' defaultChecked={defaultValue}/>
        </S.FormItem>
    )
}
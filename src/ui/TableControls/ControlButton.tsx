import * as S from './styles';

export interface ControlButtonProps {
  disabled?: boolean;
  onClick?: (param: any) => void;
  text?: string;
}

export function ControlButton({disabled, text, onClick}: ControlButtonProps) {
  return (
    <S.TableControlItem>
      <S.ControlItemButton disabled={disabled} onClick={onClick}>
        {text}
      </S.ControlItemButton>
    </S.TableControlItem>
  );
};
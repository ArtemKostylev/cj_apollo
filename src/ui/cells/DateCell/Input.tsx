import { ForwardedRef, MouseEventHandler, forwardRef, memo } from 'react';
import styled from 'styled-components';
import { convertDate } from './utils';

interface InputProps {
  value?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  short?: boolean;
}

const InputWrapper = styled.div`
  width: 100%;
  text-align: center;
  cursor: pointer;
  padding-left: 4px;
  padding-right: 4px;
  margin: 0;
`;

export const Input = memo(
  forwardRef(({ value, onClick, short }: InputProps, ref: ForwardedRef<any>) => (
    <InputWrapper onClick={onClick} ref={ref}>
      {convertDate(value, !short)}
    </InputWrapper>
  ))
);

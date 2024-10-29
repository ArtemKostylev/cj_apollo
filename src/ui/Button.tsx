import styled from 'styled-components';

interface Props extends PrimitiveComponentProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const ButtonBase = styled.button`
  cursor: pointer;
  width: fit-content;
  padding: 0 20px;
  outline: none;
  font-size: 1.3rem;
  border: none;
  line-height: 3rem;

  &:hover {
    background-color: #ddd;
  }
`;

export function Button(props: Props) {
  const { children, onClick, type, className, disabled } = props;

  return (
    <ButtonBase 
      onClick={onClick} 
      type={type} 
      className={className}
      disabled={disabled}>
      {children}
    </ButtonBase>
  )
};

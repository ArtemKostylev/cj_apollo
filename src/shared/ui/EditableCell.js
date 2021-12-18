import React from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../utils/utils';

const DropdownOption = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  text-align: center;
  padding: 0;
`;

const DropdownListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  list-style-type: none;
  padding: 0;
`;

const DropdownOptionText = styled.p`
  width: ${(props) => (props.long ? '100%' : '50%')};
  margin: 0;

  &:hover {
    background-color: #ddd;
  }
`;

const DropdownLayout = styled.div`
  display: ${({ open }) => (open ? 'block' : 'none')};
  width: ${({ width }) => width};
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  border-radius: 10px;
  position: absolute;
  margin: 0;
  z-index: 10;
  background-color: #f1f1f1;

  ${({ inverted }) => inverted && 'transform: translateY(-100%)'};
`;

const DropdownOptionsList = ({ options, onClick }) => {
  return (
    <DropdownListWrapper>
      {options.map((option) => (
        <DropdownOption>
          {option.map((it) => (
            <DropdownOptionText
              long={option.length > 1}
              value={it.value}
              onClick={onClick}
            >
              {it.text}
            </DropdownOptionText>
          ))}
        </DropdownOption>
      ))}
    </DropdownListWrapper>
  );
};

const Dropdown = ({ open, options, onClick, width }) => {
  const [inverted, setInverted] = React.useState(false);

  const ref = React.useRef();

  React.useEffect(() => {
    const bounds = ref.current.getBoundingClientRect();

    if (
      bounds.bottom >
      (window.innerHeight || document.documentElement.clientHeight)
    ) {
      setInverted(true);
    }
  }, [setInverted, open]);

  return (
    <DropdownLayout open={open} inverted={inverted} width={width} ref={ref}>
      <DropdownOptionsList options={options} onClick={onClick} />
    </DropdownLayout>
  );
};

const CellText = styled.p`
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  margin: 0px;
`;

const EditableCellLayout = styled.td`
  border-top: none;
  border: 1px solid #e6eaea;
  border-collapse: collapse;
  padding: 0px;
  cursor: pointer;
  line-height: 6vh;

  ${({ disabled }) => disabled && 'background-color: #e6eaea'};

  ${({ isWeekend }) => isWeekend && 'background-color: #eff0f0'};

  &:hover {
    background-color: #e6eaea;
  }
`;

export const EditableCell = ({
  value: initialValue,
  options,
  isWeekend = false,
  onClick,
  disabled,
}) => {
  const [value, setValue] = React.useState(initialValue);
  const [open, setOpen] = React.useState(false);

  const ref = React.useRef();

  const width = ref.current?.clientWidth || 0;

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <EditableCellLayout
      onClick={() => setOpen((prev) => !prev)}
      ref={ref}
      isWeekend={isWeekend}
      disabled={disabled}
    >
      <CellText>{value}</CellText>
      {!disabled && (
        <Dropdown
          open={open}
          options={options}
          onClick={(e) => {
            onClick(e.target.value);
            setValue(e.target.value);
          }}
          width={width}
        />
      )}
    </EditableCellLayout>
  );
};

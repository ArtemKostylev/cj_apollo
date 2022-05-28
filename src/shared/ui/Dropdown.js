import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

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
  justify-content: flex-start;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const DropdownOptionText = styled.p`
  width: ${(props) => (props.long ? '100%' : '50%')};
  margin: 0;
  line-height: 2.5em;

  &:hover {
    background-color: #ddd;
  }
`;

const DropdownLayout = styled.div`
  display: ${({open}) => (open ? 'block' : 'none')};
  width: ${({width}) => width}px;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  position: absolute;
  margin: 0;
  z-index: 10;
  background-color: #f1f1f1;
  height: fit-content;

  ${({inverted}) => inverted && 'transform: translateY(-100%)'};
`;

const DropdownOptionsList = ({options, onClick}) => {
    return (
        <DropdownListWrapper>
            {options.map((option, index) => (
                <DropdownOption key={index}>
                    {option.map((it) => (
                        <DropdownOptionText
                            key={it.value}
                            long={option.length === 1}
                            value={it.value}
                            onClick={(e) => onClick(e)}
                        >
                            {it.text}
                        </DropdownOptionText>
                    ))}
                </DropdownOption>
            ))}
        </DropdownListWrapper>
    );
};

export const Dropdown = ({open, options, onClick, width = 'auto'}) => {
    const [inverted, setInverted] = useState(false);

    const ref = useRef();

    useEffect(() => {
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
            <DropdownOptionsList options={options} onClick={onClick}/>
        </DropdownLayout>
    );
};

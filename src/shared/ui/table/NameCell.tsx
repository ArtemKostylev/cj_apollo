import styled from 'styled-components';

const NameCellBase = styled.td`
  cursor: default;
  text-align: left;
  padding-left: 10px;
`;

type Props = {
  name: string;
  surname: string;
}

export const NameCell = ({name, surname}: Props) => {
  return (
    <NameCellBase>
      {`${surname} ${name}`}
    </NameCellBase>
  )
}
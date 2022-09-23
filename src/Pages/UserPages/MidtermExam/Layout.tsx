import React from 'react';
import styled from 'styled-components';

type Props = {
  data: MidtermExam[],
  students: Student[]
}

const Table = styled.table`

`;

const TableRow = (item: MidtermExam, index: number, options: Student[]) => {
  return <tr>
    <TableInput>{index}</TableInput>
    <TableSelect options={options} valu={item.student.id}/>
    <TableInput></TableInput>
  </tr>
}

export const Layout = ({data, students}: Props) => {
  return <Table>
    {
      data.map(it => <TableRow>
        {Object.values(it).map(value => <td>{value}</td>)}
      </TableRow>)
    }
  </Table>
}
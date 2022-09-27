import React, {ReactNode} from 'react';
import styled from 'styled-components';
import {TableControls} from '../../../shared/ui/TableControls';

type Props = {
  children: ReactNode
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

export const Layout = ({children}: Props) => {
  return (<div>
    <TableControls config={controlsConfig}/>
    <Table>
      {
        Object.values(data).map(it => <TableRow>
          {Object.values(it).map(value => <td>{value}</td>)}
        </TableRow>)
      }
    </Table>
    {children}
  </div>)
}
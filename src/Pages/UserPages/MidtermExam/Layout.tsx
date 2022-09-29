import React, {ReactNode} from 'react';
import styled from 'styled-components';
import {TableControls, TableControlsConfig} from '../../../shared/ui/TableControls';
import {useMidtermExamContext} from './useMidtermExamContext';

type Props = {
  children: ReactNode;
  controlsConfig: TableControlsConfig
}

const Table = styled.table`

`;

const TableRow = ({item, index}: { item: MidtermExam, index: number }) => {
  return <tr>
    <td>{index}</td>
    <td>{item.student.name}</td>
    <td>{item.date}</td>
    <td>{item.mark}</td>
  </tr>
}

export const Layout = ({children, controlsConfig}: Props) => {

  const {data: {table}} = useMidtermExamContext()

  if (!table) return null;

  return (
    <div>
      <TableControls config={controlsConfig}/>
      <Table>
        {Object.values(table).map((it, index) => <TableRow index={index} item={it}/>)}
      </Table>
      {children}
    </div>
  )
}
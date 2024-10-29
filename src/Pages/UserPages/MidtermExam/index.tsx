import React, { memo, useMemo, useState } from 'react';
import { ProvideMidtermExam, useMidtermExamContext } from './useMidtermExamContext';
import { Spinner } from '../../../ui/Spinner';
import { TableControls, TableControlsConfig, TableControlType } from '../../../ui/TableControls';
import { PERIODS_RU, UI_DATE_FORMAT, YEARS } from '../../../constants/date';
import { useMutation } from '@apollo/client';
import { DELETE_MIDTERM_EXAM } from '../../../graphql/mutations/deleteMidtermExam';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import { TableCell } from '../../../ui/cells/styles/TableCell.styled';
import { Header } from '../../../ui/Table/style/Header.styled';
import { NameHeader } from '../../../ui/Table/NameHeader';
import { Table } from '../../../ui/Table';
import ReactModal from 'react-modal';
import { UpdateForm } from './UpdateForm';
import moment from 'moment';
import { ClassView } from '../../../ui/cells/ClassView';

const Row = styled.tr<{ selected: boolean }>`
  height: 10em;
  background-color: ${props => props.selected ? theme.darkBg : 'none'};

  td {
    border-color: ${theme.thBorder};
  }
`;

const TableRow = memo(({ item = {} as MidtermExam }: { item: MidtermExam }) => {
  const { onRowClick, selectedRecord } = useMidtermExamContext();

  return (
    <Row selected={item.number === selectedRecord?.number} onClick={() => onRowClick(item)}>
      <TableCell>{item.number + 1}</TableCell>
      <TableCell>{`${item.student?.surname || ''} ${item.student?.name || ''}`}</TableCell>
      <ClassView classNum={item.student.class} program={item.student.program} />
      <TableCell>{moment(item.date).format(UI_DATE_FORMAT)}</TableCell>
      <TableCell>{item.type?.name || ''}</TableCell>
      <TableCell>{item.contents}</TableCell>
      <TableCell>{item.result}</TableCell>
    </Row>
  )
});

const TableHeader = () => (
  <tr>
    <Header width={60}>Номер</Header>
    <NameHeader />
    <Header width={80}>Класс</Header>
    <Header width={100}>Дата</Header>
    <Header width={200}>Тип</Header>
    <Header>Программа</Header>
    <Header>Результат</Header>
  </tr>
)

const MidtermExam = () => {
  const {
    loading,
    error,
    selectedRecord,
    type,
    onTypeChange,
    year,
    period,
    onPeriodChange,
    onYearChange,
    data,
    refetch
  } = useMidtermExamContext();
  const [remove] = useMutation(DELETE_MIDTERM_EXAM);
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [updateFormVisible, setUpdateFormVisible] = useState(false);

  const controlsConfig: TableControlsConfig = useMemo(() => {
    return [
      {
        type: TableControlType.SELECT,
        options: data.types,
        text: data.types?.get(type)?.text || data?.types.values().next().value?.text,
        onClick: onTypeChange
      },
      {
        type: TableControlType.SELECT,
        options: PERIODS_RU,
        text: PERIODS_RU.get(period)?.text,
        onClick: onPeriodChange
      },
      {
        type: TableControlType.SELECT,
        options: YEARS,
        text: YEARS.get(year)?.text,
        onClick: onYearChange
      },
      {
        type: TableControlType.BUTTON,
        text: "Добавить",
        onClick: () => setCreateFormVisible(true)
      },
      {
        type: TableControlType.BUTTON,
        text: 'Изменить',
        onClick: () => setUpdateFormVisible(true),
        disabled: !selectedRecord
      },
      {
        type: TableControlType.BUTTON,
        text: 'Удалить',
        onClick: async () => {
          if (selectedRecord?.id) {
            remove({ variables: { id: selectedRecord.id } }).then(refetch);
          }
        },
        disabled: !selectedRecord
      }
    ]
  }, [year, type, selectedRecord, data.types])

  if (loading) return <Spinner />
  if (error) throw new Error('503')

  return (
    <div>
      <TableControls config={controlsConfig} />
      <Table>
        <TableHeader />
        <tbody>
          {Object.values(data.table || {}).map((it, index) => <TableRow key={it.id} item={{ ...it, number: index }} />)}
        </tbody>
      </Table>
      <ReactModal isOpen={createFormVisible}>
        <UpdateForm onClose={() => setCreateFormVisible(false)} />
      </ReactModal>
      <ReactModal isOpen={updateFormVisible}>
        <UpdateForm data={selectedRecord} onClose={(submitted: boolean) => {
          setUpdateFormVisible(false);
          submitted && refetch();
        }} />
      </ReactModal>
    </div>
  )
}

export const MidtermExamWithContext = () => (
  <ProvideMidtermExam>
    <MidtermExam />
  </ProvideMidtermExam>
)
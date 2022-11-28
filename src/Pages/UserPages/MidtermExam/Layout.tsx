import React, {memo, ReactNode} from 'react';
import {TableControls, TableControlsConfig} from '../../../ui/TableControls';
import {useMidtermExamContext} from './useMidtermExamContext';
import {Table} from '../../../ui/Table';
import {Header} from '../../../ui/Table/style/Header.styled';
import {NameHeader} from '../../../ui/Table/NameHeader';
import {AutocompleteCell} from '../../../ui/cells/SelectCell/AutocompleteCell';
import {gql, useApolloClient, useMutation} from '@apollo/client';
import {UPDATE_MIDTERM_EXAM} from '../../../graphql/mutations/updateMidtermExam';
import {DateCell} from '../../../ui/cells/DateCell';
import {getCurrentAcademicMonth} from '../../../utils/academicDate';
import moment from 'moment';
import {DATE_FORMAT} from '../../../constants/date';
import {useAuth} from '../../../hooks/useAuth';
import {FETCH_TEACHER_STUDENTS} from '../../../graphql/queries/fetchStudentsForTeacher';
import isEmpty from 'lodash/isEmpty';
import {STUDENT_FRAGMENT} from '../../../graphql/fragments/studentFragment';
import {DocumentNode} from 'graphql';
import {TableCell} from '../../../ui/cells/TableCell.styled';
import {SelectCell} from '../../../ui/cells/SelectCell';
import {ClassView} from '../../../ui/cells/ClassView';
import {InputCell} from '../../../ui/cells/InputCell';
import styled from 'styled-components';

const Row = styled.tr<{ selected: boolean }>`
  height: 10em;
  outline: ${props => props.selected ? '1px solid blue' : 'none'};
`;


type Props = {
  controlsConfig: TableControlsConfig
}

const validate = (item: MidtermExam) => {
  return Object.entries(item).map(([key, value]) => {
    if (isEmpty(value)) return key;
  })
}

const getFragment = (keys: string[]) => {
  const content = keys.join(' ');
    return gql`
        fragment Fragment on MidtermExam {
            ${content}
        }
    `
}

// process errors
const TableRow = memo(({item = {} as MidtermExam}: { item: MidtermExam }) => {
  const {year, modifyMidtermExam, data: {select}, onRowClick, selectedRecord} = useMidtermExamContext();
  const [update] = useMutation(UPDATE_MIDTERM_EXAM);
  const client = useApolloClient();

  const onBlur = () => {
    if (!validate(item).length) {
      update({variables: {data: item}})
        .then(() => console.log('Saved'))
        .catch(() => console.log('Error'));
    }
  }

  const onSelect = (id: number, typeName: string, fragment: DocumentNode) => {
    const fragmentData = client.readFragment({id: `${typeName}:${id}`, fragment});
    modifyMidtermExam({...item, student: fragmentData}, getFragment(['student']));
  }

  return (
    <Row selected={item.id === selectedRecord} onBlur={onBlur} onClick={() => {
      onRowClick(item.id)
    }}>
      <TableCell>{item.number}</TableCell>
      <SelectCell value={`${item.student?.surname || ''} ${item.student?.name || ''}`} options={select}
                  onSelect={(id) => onSelect(id as number, 'Student', STUDENT_FRAGMENT)}/>
      <ClassView classNum={item.student?.class} program={item.student?.program}/>
      <TableCell>
        <DateCell initialValue={item.date ? moment(item.date) : undefined}
                  updateDates={({date}) => modifyMidtermExam({
                    ...item,
                    date: date.format(DATE_FORMAT)
                  }, getFragment(['date']))}
                  month={getCurrentAcademicMonth()}
                  year={year}/>
      </TableCell>
      <SelectCell value={`${item.student?.surname || ''} ${item.student?.name || ''}`} options={select}
                  onSelect={(id) => onSelect(id as number, 'Student', STUDENT_FRAGMENT)}/>
      <InputCell rows={10} value={item.contents} onChange={value => modifyMidtermExam({...item, contents: value}, getFragment(['contents']))}/>
      <InputCell rows={10} value={item.result} onChange={value => modifyMidtermExam({...item, result: value}, getFragment(['result']))}/>
    </Row>
  )
});

const TableHeader = () => (
  <tr>
    <Header width={60}>Номер</Header>
    <NameHeader/>
    <Header width={80}>Класс</Header>
    <Header width={100}>Дата</Header>
    <Header width={200}>Тип</Header>
    <Header>Программа</Header>
    <Header>Результат</Header>
  </tr>
)

export const Layout = ({controlsConfig}: Props) => {

  const {data} = useMidtermExamContext();

  const table = data.table || {} as Record<string, MidtermExam>;

  return (
    <div>
      <TableControls config={controlsConfig}/>
      <Table>
        <TableHeader/>
        {Object.values(table).map((it) => <TableRow key={it.id} item={it}/>)}
      </Table>
    </div>
  )
}
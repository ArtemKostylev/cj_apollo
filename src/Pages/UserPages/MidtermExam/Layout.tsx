import React, {memo, useEffect, useState} from 'react';
import moment from 'moment';
import {TableControls, TableControlsConfig} from '../../../ui/TableControls';
import {useMidtermExamContext} from './useMidtermExamContext';
import {Table} from '../../../ui/Table';
import {Header} from '../../../ui/Table/style/Header.styled';
import {NameHeader} from '../../../ui/Table/NameHeader';
import {gql, useApolloClient, useMutation} from '@apollo/client';
import {UPDATE_MIDTERM_EXAM} from '../../../graphql/mutations/updateMidtermExam';
import {DateCell} from '../../../ui/cells/DateCell';
import {getCurrentAcademicMonth} from '../../../utils/academicDate';
import {DATE_FORMAT} from '../../../constants/date';
import isEmpty from 'lodash/isEmpty';
import {STUDENT_FRAGMENT} from '../../../graphql/fragments/studentFragment';
import {DocumentNode} from 'graphql';
import {TableCell} from '../../../ui/cells/styles/TableCell.styled';
import {SelectCell} from '../../../ui/cells/SelectCell';
import {ClassView} from '../../../ui/cells/ClassView';
import {InputCell} from '../../../ui/cells/InputCell';
import styled from 'styled-components';
import {MIDTERM_EXAM_TYPE_FRAGMENT} from '../../../graphql/fragments/midtermExamType';
import fromPairs from 'lodash/fromPairs';
import {theme} from '../../../styles/theme';

const Row = styled.tr<{ selected: boolean }>`
  height: 10em;
  background-color: ${props => props.selected ? theme.darkBg : 'none'};

  td {
    border-color: ${theme.thBorder};
  }
`;


type Props = {
  controlsConfig: TableControlsConfig
}

const validate = (item: MidtermExam) => {
  const errors = [] as string[];
  Object.entries(item).forEach(([key, value]) => {
    if (key === 'id' || key === 'number') return;
    if (isEmpty(value)) errors.push(key);
  })

  return errors
}

const getFragment = (keys: string[]) => {
  const content = keys.join(' ');
    return gql`
        fragment Fragment on MidtermExam {
            ${content}
        }
    `
}

const TableRow = memo(({item = {} as MidtermExam}: { item: MidtermExam }) => {
  const {year, modifyMidtermExam, data: {select, types}, onRowClick, selectedRecord, teacherId, refetch} = useMidtermExamContext();
  const [update] = useMutation(UPDATE_MIDTERM_EXAM);
  const client = useApolloClient();
  const [erroredFields, setErroredFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const errors = validate(item);
    setErroredFields(fromPairs(errors.map(it => [it, true])));
  }, [item])

  const onBlur = () => {
    if (!isEmpty(erroredFields)) {
      return;
    }
    update({
      variables: {
        data: {
          id: item.id,
          date: item.date,
          teacherId,
          studentId: item.student?.id,
          typeId: item.type?.id,
          contents: item.contents,
          result: item.result,
          number: item.number
        }
      },
    })
      .then(() => {
        console.log('Saved');
        refetch();
      })
      .catch(() => console.log('Error'));
  }

  const onSelect = (id: number, typeName: string, fragment: DocumentNode, key: string) => {
    const fragmentData = client.readFragment({id: `${typeName}:${id}`, fragment});
    modifyMidtermExam({...item, [key]: fragmentData}, getFragment([key]));
  }

  return (
    <Row selected={item.id === selectedRecord} onBlur={onBlur} onClick={() => {
      onRowClick(item.id)
    }}>
      <TableCell error={erroredFields.number}>{item.number}</TableCell>
      <SelectCell error={erroredFields.student} value={`${item.student?.surname || ''} ${item.student?.name || ''}`} options={select}
                  onSelect={(id) => onSelect(id as number, 'Student', STUDENT_FRAGMENT, 'student')}/>
      <ClassView classNum={item.student?.class} program={item.student?.program}/>
      <TableCell error={erroredFields.date}>
        <DateCell initialValue={item.date ? moment(item.date) : undefined}
                  updateDates={({date}) => modifyMidtermExam({
                    ...item,
                    date: date.format(DATE_FORMAT)
                  }, getFragment(['date']))}
                  month={getCurrentAcademicMonth()}
                  unlimited
                  year={year}/>
      </TableCell>
      <SelectCell error={erroredFields.type} value={item.type?.name || ''} options={types}
                  onSelect={(id) => onSelect(id as number, 'MidtermExamType', MIDTERM_EXAM_TYPE_FRAGMENT, 'type')}/>
      <InputCell rows={10} error={erroredFields.contents} value={item.contents}
                 onChange={value => modifyMidtermExam({...item, contents: value}, getFragment(['contents']))}/>
      <InputCell rows={10} error={erroredFields.result} value={item.result}
                 onChange={value => modifyMidtermExam({...item, result: value}, getFragment(['result']))}/>
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
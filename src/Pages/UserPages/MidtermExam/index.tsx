import React, {useMemo} from 'react';
import {Layout} from './Layout';
import {DEFAULT_MIDTERM_EXAM, ProvideMidtermExam, useMidtermExamContext} from './useMidtermExamContext';
import {Spinner} from '../../../ui/Spinner';
import {TableControlsConfig, TableControlType} from '../../../ui/TableControls';
import {YEARS} from '../../../constants/date';
import {useMutation} from '@apollo/client';
import {UPDATE_MIDTERM_EXAM} from '../../../graphql/mutations/updateMidtermExam';
import {DELETE_MIDTERM_EXAM} from '../../../graphql/mutations/deleteMidtermExam';

const MidtermExam = () => {
  const {loading, error, selectedRecord, type, onTypeChange, year, onYearChange, data, addMidtermExam, refetch} = useMidtermExamContext();
  const [remove] = useMutation(DELETE_MIDTERM_EXAM);

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
        options: YEARS,
        text: YEARS.get(year)?.text,
        onClick: onYearChange
      },
      {
        type: TableControlType.BUTTON,
        text: "Добавить",
        onClick: () => {
          addMidtermExam({...DEFAULT_MIDTERM_EXAM, number: 1 + (data?.table?.[data?.table?.length - 1].number || 0)})
        },
      },
      {
        type: TableControlType.BUTTON,
        text: 'Удалить',
        onClick: async () => {
          await remove({variables: {id: selectedRecord}});
          refetch();
        },
        disabled: selectedRecord === undefined
      }
    ]
  }, [year, type, selectedRecord, data.types])

  if (loading) return <Spinner/>
  if (error) throw new Error('503')

  return (<Layout controlsConfig={controlsConfig}/>)
}

export const MidtermExamWithContext = () => (
  <ProvideMidtermExam>
    <MidtermExam/>
  </ProvideMidtermExam>
)
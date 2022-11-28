import React, {useMemo} from 'react';
import {Layout} from './Layout';
import {DEFAULT_MIDTERM_EXAM, ProvideMidtermExam, useMidtermExamContext} from './useMidtermExamContext';
import {Spinner} from '../../../ui/Spinner';
import {TableControlsConfig, TableControlType} from '../../../ui/TableControls';
import {YEARS} from '../../../constants/date';

const MidtermExam = () => {
  const {loading, error, selectedRecord, type, onTypeChange, year, onYearChange, data, addMidtermExam} = useMidtermExamContext();

  const controlsConfig: TableControlsConfig = useMemo(() => {
    return [
      {
        type: TableControlType.SELECT,
        options: new Map(data.types?.map(it => [it.id, it.name])),
        text: data?.types?.[type]?.name,
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
        onClick: () => addMidtermExam(DEFAULT_MIDTERM_EXAM),
      },
      {
        type: TableControlType.BUTTON,
        text: 'Удалить',
        onClick: () => {
        },
        disabled: selectedRecord === undefined
      }
    ]
  }, [year, type, selectedRecord])

  if (loading) return <Spinner/>
  if (error) throw new Error('503')

  return (<Layout controlsConfig={controlsConfig}/>)
}

export const MidtermExamWithContext = () => (
  <ProvideMidtermExam>
    <MidtermExam/>
  </ProvideMidtermExam>
)
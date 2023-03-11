import React, {useMemo} from 'react';
import {Layout} from './Layout';
import {DEFAULT_MIDTERM_EXAM, ProvideMidtermExam, useMidtermExamContext} from './useMidtermExamContext';
import {Spinner} from '../../../ui/Spinner';
import {TableControlsConfig, TableControlType} from '../../../ui/TableControls';
import {PERIODS_RU, YEARS} from '../../../constants/date';
import {useMutation} from '@apollo/client';
import {DELETE_MIDTERM_EXAM} from '../../../graphql/mutations/deleteMidtermExam';
import {getBorderDatesForPeriod} from '../../../utils/academicDate';
import moment from 'moment';

const getType = (data: DropdownOptionType | undefined): MidtermExamType | null => {
  if (!data) return null;
  return {
    __typename: 'MidtermExamType',
    id: (data.value as number),
    name: data.text
  }
};

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
    addMidtermExam,
    removeMidtermExam,
  } = useMidtermExamContext();
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
        onClick: () => {
          addMidtermExam({
            ...DEFAULT_MIDTERM_EXAM,
            number: 1 + (data?.table?.[data?.table?.length - 1]?.number || 0),
            type: getType(data.types?.get(type)),
            date: getBorderDatesForPeriod(period, moment().year()).dateGte.add(1, 'days').format()
          })
        },
      },
      {
        type: TableControlType.BUTTON,
        text: 'Удалить',
        onClick: async () => {
          if (!selectedRecord) return;
          if (selectedRecord.id) {
            await remove({variables: {id: selectedRecord.id}});
          }
          removeMidtermExam(selectedRecord);
        },
        disabled: selectedRecord === undefined
      }
    ]
  }, [year, type, selectedRecord, data.types])

  if (loading) return <Spinner/>
  if (error) throw new Error('503')

  return <Layout controlsConfig={controlsConfig}/>
}

export const MidtermExamWithContext = () => (
  <ProvideMidtermExam>
    <MidtermExam/>
  </ProvideMidtermExam>
)
import React, {useCallback, useMemo, useState} from 'react';
import {Layout} from './Layout';
import {ProvideMidtermExam, useMidtermExamContext} from './useMidtermExamContext';
import ReactModal from 'react-modal';
import {Spinner} from '../../../shared/ui/Spinner';
import {EditForm} from './EditForm';
import {TableControlsConfig, TableControlType} from '../../../shared/ui/TableControls';
import {QUARTERS_RU} from '../../../constants/quarters';
import {YEARS} from '../../../constants/years';
import {MidtermExamLabel} from '../../../constants/midtermExamType';
import {PERIOD_NAMES, YEAR_PERIODS} from '../../../constants/periods';
import {PeriodsRu} from '../../../@types/date';

export const MidtermExam = () => {
  const {loading, error, remove, period, onPeriodChange, selectedRecord, type, onTypeChange, year, onYearChange} = useMidtermExamContext();
  const [modalOpened, setModalOpened] = useState(false);

  const onCrudClick = useCallback(() => {
    setModalOpened(true);
  }, []);

  const onDeleteClick = useCallback(async () => {
    await remove({
      variables: {
        id: selectedRecord
      }
    });
  }, []);


  const onClose = useCallback(() => {
    setModalOpened(false);
  }, [])

  const controlsConfig = useMemo(() => [
    {
      type: TableControlType.SELECT,
      data: PeriodsRu,
      text: PeriodsRu[period],
      onClick: onPeriodChange
    },
    {
      type: TableControlType.SELECT,
      data: MidtermExamLabel,
      text: MidtermExamLabel[type],
      onClick: onTypeChange
    },
    {
      type: TableControlType.SELECT,
      data: YEARS,
      value: YEARS[year],
      onClick: onYearChange
    },
    {
      type: TableControlType.BUTTON,
      text: "Добавить",
      onClick: onCrudClick,
    },
    {
      type: TableControlType.BUTTON,
      text: 'Изменить',
      onClick: onCrudClick,
      disabled: !selectedRecord
    },
    {
      type: TableControlType.BUTTON,
      text: 'Удалить',
      onClick: onDeleteClick,
      disabled: !selectedRecord
    }
  ], [])

  if (loading) return <Spinner/>
  if (error) throw new Error('503')

  return (
    <Layout controlsConfig={controlsConfig}>
      <ReactModal isOpen={modalOpened}
                  className='modal'
                  overlayClassName='overlay'>
        <EditForm onClose={onClose}/>
      </ReactModal>
    </Layout>
  )
}
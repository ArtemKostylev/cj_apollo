import React, {useCallback, useMemo, useState} from 'react';
import {Layout} from './Layout';
import {ProvideMidtermExam, useMidtermExamContext} from './useMidtermExamContext';
import ReactModal from 'react-modal';
import {Spinner} from '../../../shared/ui/Spinner';
import {EditForm} from './EditForm';
import {TableControlsConfig, TableControlType} from '../../../shared/ui/TableControls';
import {MidtermExamLabel} from '../../../constants/midtermExamType';
import {PERIODS_RU, YEARS} from '../../../@types/date';
import {DropdownOptionType} from '../../../shared/ui/Dropdown';

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

  const controlsConfig: TableControlsConfig = useMemo(() => [
    {
      type: TableControlType.SELECT,
      options: new Map() as Map<string, DropdownOptionType>,
      text: MidtermExamLabel[type],
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
  ], [year, type])

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
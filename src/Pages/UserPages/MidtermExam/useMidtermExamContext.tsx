import React, {useState, useContext, createContext, ReactNode, useCallback, useMemo} from 'react';
import {getQuarter, getYear} from '../../../utils/date';
import moment from 'moment';
import {useMetaData} from '../../../hooks/useMetaData';
import {useMutation, useQuery} from '@apollo/client';
import {MidtermExam} from './index';
import {TableControlsConfig, TableControlType} from '../../../shared/ui/TableControls';
import {QUARTERS_RU} from '../../../constants/quarters';
import {YEARS} from '../../../constants/years';
import {normalizeByKey} from '../../../utils/nornalizer';

const MidtermExamContext = createContext({} as MidtermExamContext);

type Props = {
  children: ReactNode;
}

interface MidtermExamsData {
  midtermExams: MidtermExam[];
}

interface StudentsData {
  students: Student[];
}

type MidtermExamContext = {
  loading: boolean;
  data: {
    select: Student[] | undefined;
    table: MidtermExam[] | undefined;
  };
  error: any;
  controlsConfig: TableControlsConfig;
  selectedRecord: string;
  modalOpened: boolean
  onClose: () => void;
}

export function ProvideMidtermExam({children}: Props) {
  const value = useProvideMidtermExam();
  return <MidtermExamContext.Provider value={value}>{children}</MidtermExamContext.Provider>;
}

export const useMidtermExamContext = () => {
  return useContext(MidtermExamContext);
};

function useProvideMidtermExam() {
  const {teacherId} = useMetaData();

  const {loading: studentsLoading, data: studentsData, error: studentsError} = useQuery<StudentsData>();
  const {loading: midtermExamLoading, data: midtermExamData, error: midtermExamError} = useQuery<MidtermExamsData>();
  const [update] = useMutation();
  const [remove] = useMutation();

  const [quarter, setQuarter] = useState(getQuarter(moment().month()));
  const [year, setYear] = useState(getYear(moment().month()));
  const [selectedRecord, setSelectedRecord] = useState<string | undefined>(undefined);
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

  const onRowClick = useCallback((id: string) => {
    setSelectedRecord(id);
  }, [])

  const onClose = useCallback(() => {
    setModalOpened(false);
  }, [])

  const controlsConfig = useMemo(() => [
    {
      type: TableControlType.SELECT,
      data: QUARTERS_RU,
      text: QUARTERS_RU[quarter],
      onClick: setQuarter,
    },
    {
      type: TableControlType.SELECT,
      data: YEARS,
      value: YEARS[year],
      onClick: setYear,
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

  return {
    loading: midtermExamLoading || studentsLoading,
    data: {
      select: studentsData?.students,
      table: midtermExamData?.midtermExams.reduce(normalizeByKey('id'), {})
    },
    error: studentsError || midtermExamError,
    controlsConfig,
    selectedRecord,
    setSelectedRecord,
    modalOpened,
    onClose
  }
}
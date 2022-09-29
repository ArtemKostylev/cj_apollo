import React, {useState, useContext, createContext, ReactNode, useCallback} from 'react';
import {getYear} from '../../../utils/date';
import moment from 'moment';
import {useMutation, useQuery} from '@apollo/client';
import {MidtermExam} from './index';

import {normalizeByKey} from '../../../utils/nornalizer';
import {MidtermExamType} from '../../../constants/midtermExamType';
import {FETCH_STUDENTS_FOR_TEACHER} from '../../../graphql/queries/fetchStudentsForTeacher';
import {useAuth} from '../../../hooks/useAuth';

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
    table: Record<string, MidtermExam> | undefined;
  };
  error: any;
  selectedRecord: string | undefined;
  onRowClick: (value: string) => void;
  onTypeChange: (value: string) => void;
  onYearChange: (value: number) => void;
  update: any;
  remove: any;
  type: string;
  year: number;
}

export function ProvideMidtermExam({children}: Props) {
  const value = useProvideMidtermExam();
  return <MidtermExamContext.Provider value={value}>{children}</MidtermExamContext.Provider>;
}

export const useMidtermExamContext = () => {
  return useContext(MidtermExamContext);
};

function useProvideMidtermExam() {
  const [type, setType] = useState<string>(MidtermExamType.CREDIT);
  const [year, setYear] = useState<number>(getYear(moment().month()));
  const {user: {versions}} = useAuth();

  const {loading: studentsLoading, data: studentsData, error: studentsError} = useQuery<StudentsData>(FETCH_STUDENTS_FOR_TEACHER, {
    variables: {teacherId: versions[year].id, year}
  });
  const {loading: midtermExamLoading, data: midtermExamData, error: midtermExamError} = useQuery<MidtermExamsData>();
  const [update] = useMutation();
  const [remove] = useMutation();

  const onTypeChange = useCallback((value: string) => setType(value), []);
  const onYearChange = useCallback((value: number) => setYear(value), []);

  const [selectedRecord, setSelectedRecord] = useState<string | undefined>(undefined);

  const onRowClick = useCallback((id: string) => setSelectedRecord(id), [])

  return {
    loading: midtermExamLoading || studentsLoading,
    data: {
      select: studentsData?.students,
      table: midtermExamData?.midtermExams.reduce(normalizeByKey<MidtermExam>('id'), {})
    },
    error: studentsError || midtermExamError,
    selectedRecord,
    onRowClick,
    onTypeChange,
    onYearChange,
    remove,
    update,
    type,
    year
  }
}
import React, {useState, useContext, createContext, ReactNode, useCallback} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {MidtermExam} from './index';
import {normalizeByKey} from '../../../utils/nornalizer';
import {MidtermExamType} from '../../../constants/midtermExamType';
import {FETCH_STUDENTS_FOR_TEACHER} from '../../../graphql/queries/fetchStudentsForTeacher';
import {useAuth} from '../../../hooks/useAuth';
import {FETCH_MIDTERM_EXAMS} from '../../../graphql/queries/fetchMidtermExams';
import {getBorderDatesForPeriod, getCurrentAcademicPeriod, getCurrentAcademicYear} from '../../../utils/academicDate';
import {Periods} from '../../../@types/date';
import {UPDATE_MIDTERM_EXAM} from '../../../graphql/mutations/updateMidtermExam';
import {DELETE_MIDTERM_EXAM} from '../../../graphql/mutations/deleteMidtermExam';

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
  onPeriodChange: (value: Periods) => void;
  update: any;
  remove: any;
  type: string;
  year: number;
  period: Periods;
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
  const [year, setYear] = useState<number>(getCurrentAcademicYear());
  const [period, setPeriod] = useState<Periods>(getCurrentAcademicPeriod());
  const {user: {versions}} = useAuth();

  const {loading: studentsLoading, data: studentsData, error: studentsError} = useQuery<StudentsData>(FETCH_STUDENTS_FOR_TEACHER, {
    variables: {teacherId: versions[year].id, year}
  });
  const {loading: midtermExamLoading, data: midtermExamData, error: midtermExamError} = useQuery<MidtermExamsData>(FETCH_MIDTERM_EXAMS, {
    variables: {teacherId: versions[year].id, type, ...getBorderDatesForPeriod(period, year)}
  });
  const [update] = useMutation(UPDATE_MIDTERM_EXAM);
  const [remove] = useMutation(DELETE_MIDTERM_EXAM);

  const onTypeChange = useCallback((value: string) => setType(value), []);
  const onYearChange = useCallback((value: number) => setYear(value), []);
  const onPeriodChange = useCallback((value: Periods) => setPeriod(value), []);

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
    onPeriodChange,
    remove,
    update,
    type,
    year,
    period
  }
}
import React, {useState, useContext, createContext, ReactNode, useCallback} from 'react';
import {useQuery} from '@apollo/client';
import {FETCH_TEACHER_STUDENTS} from '../../../graphql/queries/fetchStudentsForTeacher';
import {useAuth} from '../../../hooks/useAuth';
import {FETCH_MIDTERM_EXAMS} from '../../../graphql/queries/fetchMidtermExams';
import {getBorderDatesForPeriod, getCurrentAcademicPeriod, getCurrentAcademicYear} from '../../../utils/academicDate';
import {Periods} from '../../../constants/date';
import {FETCH_MIDTERM_EXAM_TYPES} from '../../../graphql/queries/fetchMidterExamTypes';
import {addToQuery, Data, modifyEntity, useApollo} from '../../../hooks/useApolloCache';
import {normalizeByKey, toDropdownOption} from '../../../utils/normalizer';

const MidtermExamContext = createContext({} as MidtermExamContext);

type Props = {
  children: ReactNode;
}

interface MidtermExamsTypeData {
  fetchMidtermExamTypes: MidtermExamType[];
}

interface StudentsData {
  fetchTeacherStudents: Student[];
}

type MidtermExamContext = {
  loading: boolean;
  data: {
    table: Record<string, MidtermExam> | undefined;
    select: Map<string | number, DropdownOptionType>;
    types: MidtermExamType[] | undefined;
  };
  error: any;
  selectedRecord: number | undefined;
  onRowClick: (value: number) => void;
  onTypeChange: (value: number) => void;
  onYearChange: (value: number) => void;
  onPeriodChange: (value: Periods) => void;
  type: number;
  year: number;
  period: Periods;
  modifyMidtermExam: modifyEntity<MidtermExam>,
  addMidtermExam: addToQuery<MidtermExam>
}

export function ProvideMidtermExam({children}: Props) {
  const value = useProvideMidtermExam();
  return <MidtermExamContext.Provider value={value}>{children}</MidtermExamContext.Provider>;
}

export const useMidtermExamContext = () => {
  return useContext(MidtermExamContext);
};

export const DEFAULT_MIDTERM_EXAM = {
  __typename: 'MidtermExam',
  id: 0,
  number: 1,
  contents: '',
  student: null,
  date: null,
  result: '',
  type: null,
};

function useProvideMidtermExam() {
  const [type, setType] = useState<number>(0);
  const [year, setYear] = useState<number>(getCurrentAcademicYear());
  const [period, setPeriod] = useState<Periods>(getCurrentAcademicPeriod());
  const [selectedRecord, setSelectedRecord] = useState<number | undefined>(undefined);
  const {user: {versions}} = useAuth();

  const onTypeChange = useCallback((value: number) => setType(value), []);
  const onYearChange = useCallback((value: number) => setYear(value), []);
  const onPeriodChange = useCallback((value: Periods) => setPeriod(value), []);
  const onRowClick = useCallback((id: number) => setSelectedRecord(id), [])

  const {
    loading: studentsLoading,
    data: studentsData,
    error: studentsError
  } = useQuery<StudentsData>(FETCH_TEACHER_STUDENTS, {
    variables: {teacherId: versions[year].id, year}
  }); //? is this needed here????

  const {
    loading: midtermExamTypesLoading,
    data: midtermExamTypes,
    error: midtermExamTypesError
  } = useQuery<MidtermExamsTypeData>(FETCH_MIDTERM_EXAM_TYPES);  //? is this needed here????

  const [{loading, error, data}, modifyMidtermExam, addMidtermExam] = useApollo<MidtermExam>(
    FETCH_MIDTERM_EXAMS, {
      teacherId: versions[year].id, year, typeId: type, ...getBorderDatesForPeriod(period, year)
    },
    'fetchMidtermExams'
  );

  return {
    data: {
      table: data?.reduce(normalizeByKey<MidtermExam>('id'), {}),
      select: toDropdownOption<Student>(studentsData?.fetchTeacherStudents, it => `${it.surname || ''} ${it.name || ''}`),
      types: midtermExamTypes?.fetchMidtermExamTypes
    },
    loading: loading || studentsLoading || midtermExamTypesLoading,
    error: studentsError || error || midtermExamTypesError,
    selectedRecord,
    onRowClick,
    onTypeChange,
    onYearChange,
    onPeriodChange,
    type,
    year,
    period,
    modifyMidtermExam,
    addMidtermExam
  }
}
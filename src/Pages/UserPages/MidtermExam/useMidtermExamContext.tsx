import React, {useState, useContext, createContext, ReactNode, useCallback} from 'react';
import {useQuery} from '@apollo/client';
import {FETCH_TEACHER_STUDENTS} from '../../../graphql/queries/fetchStudentsForTeacher';
import {useAuth} from '../../../hooks/useAuth';
import {FETCH_MIDTERM_EXAMS} from '../../../graphql/queries/fetchMidtermExams';
import {getCurrentAcademicPeriod, getCurrentAcademicYear} from '../../../utils/academicDate';
import {Periods} from '../../../constants/date';
import {FETCH_MIDTERM_EXAM_TYPES} from '../../../graphql/queries/fetchMidterExamTypes';
import {addToQuery, modifyEntity, useApollo} from '../../../hooks/useApolloCache';
import {toDropdownOption} from '../../../utils/normalizer';

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
    table: MidtermExam[] | undefined;
    select: Map<string | number, DropdownOptionType>;
    types: Map<string | number, DropdownOptionType>;
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
  teacherId: number;
  refetch: () => void;
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
  } = useQuery<MidtermExamsTypeData>(FETCH_MIDTERM_EXAM_TYPES, {onCompleted: (data) => setType(data.fetchMidtermExamTypes[0].id)});  //? is this needed here????

  const [{loading, error, data, refetch}, modifyMidtermExam, addMidtermExam] = useApollo<MidtermExam>(
    FETCH_MIDTERM_EXAMS, {
      teacherId: versions[year].id, year, typeId: type
    },
    'fetchMidtermExams'
  );

  return {
    data: {
      table: data,
      select: toDropdownOption<Student>(studentsData?.fetchTeacherStudents, it => `${it.surname || ''} ${it.name || ''}`),
      types: toDropdownOption<MidtermExamType>(midtermExamTypes?.fetchMidtermExamTypes, it => it.name)
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
    refetch,
    teacherId: versions[year].id,
    modifyMidtermExam,
    addMidtermExam
  }
}
import React from 'react';
import {useMetaData} from '../../../hooks/useMetaData';
import {useQuery} from '@apollo/client';
import {Spinner} from '../../../shared/ui/Spinner';
import {Layout} from './Layout';

interface MidtermExamsData {
  midtermExams: MidtermExam[];
}

interface StudentsData {
  students: Student[];
}

export const MidtermExam = () => {
  const {teacherId} = useMetaData();

  const {loading: studentsLoading, data: studentsData, error: studentsError} = useQuery<StudentsData>();
  const {loading: midtermExamLoading, data: midtermExamData, error: midtermExamError} = useQuery<MidtermExamsData>();

  if (studentsLoading || midtermExamLoading) return <Spinner/>;

  if (studentsError || midtermExamError) throw new Error('500');

  return <Layout data={midtermExamData?.midtermExams} students={studentsData?.students}/>
}
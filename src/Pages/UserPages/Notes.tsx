import {useAuth} from '../../hooks/useAuth';
import '../../styles/Notes.css';
import {TableControlsConfig, TableControlType} from '../../ui/TableControls/types';
import {PageWrapper} from '../../ui/PageWrapper';
import {useCallback, useMemo, useState} from 'react';
import {NetworkStatus, useMutation, useQuery} from '@apollo/client';
import {FETCH_NOTES_QUERY} from '../../graphql/queries/fetchNotes';
import {UPDATE_NOTE_MUTATION} from '../../graphql/mutations/updateNotes';
import {useLocation} from 'react-router-dom';
import {YEARS} from '../../constants/date';
import styled from 'styled-components';
import {theme} from '../../styles/theme';
import {getCurrentAcademicYear} from '../../utils/academicDate';

const TextArea = styled.textarea`
  border: 1px solid ${theme.borderDark};
  border-radius: 5px;
`

export const Notes = () => {
  const auth = useAuth();
  const location = useLocation() as any;

  const [currentYear, setCurrentYear] = useState(getCurrentAcademicYear());
  const [course, setCourse] = useState(0);

  const [value, setValue] = useState('');

  const onYearChange = useCallback((year: number) => {
    setCurrentYear(year);
  }, []);

  const onCourseChange = useCallback((course: number) => {
    setCourse(course);
  }, []);

  const onTextAreaValueChange = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);


  const teacher = useMemo(() => location.state?.versions[currentYear].id || auth.user.versions[currentYear].id, [currentYear, auth])
  const userCourses: Course[] = useMemo(() => location.state?.courses || auth.user?.versions[currentYear].courses, [location, auth, currentYear])

  const [update] = useMutation(UPDATE_NOTE_MUTATION);

  const save = async () => {
    await update({
      variables: {
        data: {
          id: data.fetchNotes ? data.fetchNotes.id : 0,
          text: value,
          teacherId: teacher,
          courseId: userCourses[course].id,
          year: currentYear,
        },
      },
      onCompleted: () => refetch()
    });
  };

  const {loading, data, error, refetch, networkStatus} = useQuery(
    FETCH_NOTES_QUERY,
    {
      variables: {
        teacherId: teacher,
        courseId: userCourses[course].id,
        year: currentYear,
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: data => setValue(data?.fetchNotes?.text)
    }
  );

  /*  const controlsConfig: TableControlsConfig = useMemo(() => [
      {
        type: TableControlType.SELECT,
        options: new Map(userCourses.map((it, index) => [index, {value: index, text: it.name}])),
        text: userCourses[course].name,
        onClick: onCourseChange,
      },
      {
        type: TableControlType.SELECT,
        options: YEARS,
        text: YEARS.get(currentYear)?.text,
        onClick: onYearChange,
      },
      {
        type: TableControlType.BUTTON,
        text: "Сохранить",
        onClick: save,
      }
    ], [userCourses, currentYear, course, value, data]);*/

  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;

  if (error) throw new Error('503');

  if (value === '' && data.fetchNotes && data.fetchNotes.text !== '') setValue(data.fetchNotes.text);

  return (
    <PageWrapper>
      <TextArea
        placeholder='Это - место для заметок...'
        value={value}
        onChange={onTextAreaValueChange}
      />
    </PageWrapper>
  );
};

import { useAuth } from '../../../utils/use-auth';
import '../../../styles/Notes.css';
import Controls from '../../../shared/ui/Controls';
import { PageWrapper } from '../../../shared/ui/PageWrapper';
import { useEffect, useState } from 'react';
import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import { FETCH_NOTES_QUERY } from '../../../utils/queries';
import { UPDATE_NOTE_MUTATION } from '../../../utils/mutations';
import moment from 'moment';

export const Notes = (props) => {
  const auth = useAuth();

  const listener = (event) => {
    if (changed) {
      event.preventDefault();
      let confirm = window.confirm(
        'Вы действительно хотите покинуть страницу? Все несохраненные изменения будут потеряны.'
      );
      !confirm ? event.stopImmediatePropagation() : setChanged(false);
    }
  };

  useEffect(() => {
    props.menuRef?.current.addEventListener('click', listener);

    return () => {
      props.menuRef?.current?.removeEventListener('click', listener);
    };
  });

  const year = moment().month() > 7 ? moment().year() : moment().year() - 1;
  const [course, setCourse] = useState(0);
  const [changed, setChanged] = useState(false);

  const getCourse = (e) => {
    setCourse(e.target.getAttribute('data-index'));
    setValue('');
    refetch();
  };

  const [update] = useMutation(UPDATE_NOTE_MUTATION);

  const save = async (e) => {
    await update({
      variables: {
        data: {
          id: data.fetchNotes ? data.fetchNotes.id : 0,
          text: value,
          teacherId: props.location.state?.teacher || auth.user.teacher,
          courseId:
            props.location.state?.courses[course].id ||
            auth.user.courses[course].id,
          year: year,
        },
      },
    });
    refetch();
    setChanged(false);
  };

  const { loading, data, error, refetch, networkStatus } = useQuery(
    FETCH_NOTES_QUERY,
    {
      variables: {
        teacherId: props.location.state?.teacher || auth.user?.teacher,
        courseId:
          props.location.state?.courses[course].id ||
          auth.user.courses[course].id,
        year: parseInt(year),
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
    }
  );

  const [value, setValue] = useState('');

  const items = [
    {
      type: 'dropdown',
      data:
        props.location.state?.courses.map((course) => course.name) ||
        auth.user.courses.map((course) => course.name),
      label: 'Предмет :',
      text:
        props.location.state?.courses[course].name ||
        auth.user.courses[course].name,
      onClick: getCourse,
    },
    {
      type: 'button',
      text: 'Сохранить',
      onClick: save,
    },
    {
      type: 'button',
      text: 'Отменить изменения',
      onClick: () => refetch(),
    },
  ];

  const spinner = <div>Загрузка</div>;

  if (loading) return spinner;
  if (networkStatus === NetworkStatus.refetch) return spinner;

  if (error) throw new Error(503);

  if (
    value === '' &&
    data.fetchNotes &&
    data.fetchNotes.text !== '' &&
    !changed
  )
    setValue(data.fetchNotes.text);

  const change = (e) => {
    setChanged(true);
    setValue(e.target.value);
  };

  return (
    <PageWrapper>
      <Controls items={items} />
      <textarea
        placeholder='Это - место для заметок...'
        value={value}
        onChange={change}
      ></textarea>
    </PageWrapper>
  );
};

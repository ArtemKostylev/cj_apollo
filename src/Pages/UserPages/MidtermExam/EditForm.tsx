import React from 'react';
import {useFormik} from 'formik';
import {useMidtermExamContext} from './useMidtermExamContext';
import {Button} from '../../../ui/Button';

const INITIAL_VALUES = {
  student: '',
  date: '',
  content: '',
  type: ''
}

type Props = {
  onClose: () => void;
}

export const EditForm = ({onClose}: Props) => {
  const {} = useMidtermExamContext();

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: (values) => {
      onClose()
    },
  });

  return (
    <form>
      <select
        id="student"
        name="student"
        onChange={formik.handleChange}
        value={formik.values.student}
        placeholder="Логин"
      />
      <input
        id="password"
        name="password"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.date}
        placeholder="Пароль"
      />
      <Button type="submit">Войти</Button>
    </form>
  )
}
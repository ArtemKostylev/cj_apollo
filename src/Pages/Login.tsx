import React, {useState} from 'react';
import styled from 'styled-components';
import {useFormik} from 'formik';
import {useMutation} from '@apollo/client';
import {SIGN_IN} from '../graphql/mutations/signIn';
import {useHistory} from 'react-router-dom';
import {Button} from '../ui/Button';
import {useAuth} from '../hooks/useAuth';

const LoginFormLayout = styled.form`
  width: 40%;
  height: 40%;
  margin: auto;
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  justify-items: center;
  align-items: center;
  row-gap: 25px;

  span {
    white-space: nowrap;
    text-align: center;
  }
`;

const FormItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const FormHeader = styled.h1`
  text-transform: uppercase;
  margin: 0;
  min-width: 400px;
  white-space: nowrap;
  text-align: center;
`;

const Input = styled.input`
  text-indent: 10px;
  line-height: 3rem;
  font-size: 1.3rem;
  outline: none;
  border: none;
  width: 70%;
  min-width: 400px;
  background-color: #e6eaea;

  &:-webkit-autofill::first-line {
    font-size: 1.3rem;
  }
`;

export const Login = () => {
  const history = useHistory();
  let auth = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const [login, {loading}] = useMutation(SIGN_IN, {
    onCompleted: (payload) => {
      auth.signIn(payload.signIn, () => {
        history.push('/');
      });
    },
    onError: (e: any) => {
      setErrorMessage('Неправильное имя пользователя или пароль');
    },
  });

  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    onSubmit: (values) =>
      login({
        variables: {
          login: values.login.trim().toLowerCase(),
          password: values.password,
        },
      }),
  });

  return (
    <LoginFormLayout
      onSubmit={formik.handleSubmit}
      onKeyDown={(e) => {
        if (e.code === 'Enter') formik.handleSubmit();
      }}
    >
      <FormHeader>Добро пожаловать!</FormHeader>
      <span>Пожалуйста, введите логин и пароль</span>
      <FormItemWrapper>
        <Input
          id="login"
          name="login"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.login}
          placeholder="Логин"
        />
      </FormItemWrapper>
      <FormItemWrapper>
        <Input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          placeholder="Пароль"
        />
      </FormItemWrapper>
      {errorMessage && <span>{errorMessage}</span>}
      <Button type="submit">Войти</Button>
    </LoginFormLayout>
  );
};

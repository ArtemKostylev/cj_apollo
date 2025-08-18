import { useState } from 'react';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import { SIGN_IN } from '../../graphql/mutations/signIn';
import { useHistory } from 'react-router-dom';
import { Button } from '~/components/button';
import { useUserData } from '../../hooks/useUserData';
import styles from './login.module.css';

export const Login = () => {
    const history = useHistory();
    let auth = useUserData();
    const [errorMessage, setErrorMessage] = useState('');

    const [login, { loading }] = useMutation(SIGN_IN, {
        onCompleted: (payload) => {
            auth.signIn(payload.signIn, () => {
                history.push('/');
            });
        },
        onError: (e: any) => {
            setErrorMessage('Неправильное имя пользователя или пароль');
        }
    });

    const formik = useFormik({
        initialValues: {
            login: '',
            password: ''
        },
        onSubmit: (values) =>
            login({
                variables: {
                    login: values.login.trim().toLowerCase(),
                    password: values.password
                }
            })
    });

    return (
        <form
            className={styles.formLayout}
            onSubmit={formik.handleSubmit}
            onKeyDown={(e) => {
                if (e.code === 'Enter') formik.handleSubmit();
            }}
        >
            <h1 className={styles.header}>Добро пожаловать!</h1>
            <span>Пожалуйста, введите логин и пароль</span>
            <div className={styles.formItem}>
                <input
                    className={styles.input}
                    id="login"
                    name="login"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.login}
                    placeholder="Логин"
                />
            </div>
            <div className={styles.formItem}>
                <input
                    className={styles.input}
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder="Пароль"
                />
            </div>
            {errorMessage && <span>{errorMessage}</span>}
            <Button type="submit">Войти</Button>
        </form>
    );
};

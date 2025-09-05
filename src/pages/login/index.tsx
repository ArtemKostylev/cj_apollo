import { useState } from 'react';
import { useFormik } from 'formik';
import { Button } from '~/components/button';
import { useUserData } from '~/hooks/useUserData';
import styles from './login.module.css';
import { useNavigate } from '@tanstack/react-router';
import { login } from '~/api/user';
import { useMutation } from '@tanstack/react-query';
import { Route as LoginRoute } from '~/routes/login';
import { Route as IndexRoute } from '~/routes';
import { PageWrapper } from '~/components/pageWrapper';

export const Login = () => {
    const navigate = useNavigate();
    const search = LoginRoute.useSearch();
    const { logIn } = useUserData();
    const [errorMessage, setErrorMessage] = useState('');

    const { mutate: loginMutation, isPending } = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            logIn(data);
            setTimeout(() => {
                navigate({ to: search.redirect || IndexRoute.fullPath, search: {} });
            }, 200);
        },
        onError: (_) => {
            setErrorMessage('Неправильное имя пользователя или пароль');
        }
    });

    const formik = useFormik({
        initialValues: {
            login: '',
            password: ''
        },
        onSubmit: (values) =>
            loginMutation({
                login: values.login.trim().toLowerCase(),
                password: values.password
            })
    });

    return (
        <PageWrapper>
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
                <Button type="submit" disabled={isPending}>
                    Войти
                </Button>
            </form>
        </PageWrapper>
    );
};

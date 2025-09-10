import { useCallback, useState } from 'react';
import { Button } from '~/components/button';
import { useUserData } from '~/hooks/useUserData';
import styles from './login.module.css';
import { useNavigate } from '@tanstack/react-router';
import { login } from '~/api/user';
import { useMutation } from '@tanstack/react-query';
import { Route as LoginRoute } from '~/routes/login';
import { Route as IndexRoute } from '~/routes';
import { PageWrapper } from '~/components/pageWrapper';
import { Form, FormInput } from '~/components/form';

interface LoginFormValues {
    login: string;
    password: string;
}

const defaultValues: LoginFormValues = {
    login: '',
    password: ''
};

export const Login = () => {
    const navigate = useNavigate();
    const search = LoginRoute.useSearch();
    const { logIn } = useUserData();

    const {
        mutate: loginMutation,
        isPending,
        isError,
        error
    } = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            logIn(data);
            setTimeout(() => {
                navigate({ to: search.redirect || IndexRoute.fullPath, search: {} });
            }, 200);
        }
    });

    const onSubmit = useCallback(
        (values: LoginFormValues) => {
            loginMutation({
                login: values.login.trim().toLowerCase(),
                password: values.password
            });
        },
        [loginMutation]
    );

    return (
        <PageWrapper className={styles.wrapper}>
            <h1 className={styles.title}>Добро пожаловать!</h1>
            <h2 className={styles.subtitle}>Для получения доступа к журналу введите ваш логин и пароль</h2>
            <div className={styles.form}>
                <Form<LoginFormValues>
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    submitError={isError && error?.message}
                >
                    <FormInput name="login" label="Логин" type="text" />
                    <FormInput name="password" label="Пароль" type="password" />
                    <Button type="submit" loading={isPending}>
                        Войти
                    </Button>
                </Form>
            </div>
        </PageWrapper>
    );
};

import React from 'react';

export const EditForm = () => {
  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    onSubmit: (values) =>
      login({
        variables: {
          login: values.login,
          password: values.password,
        },
      }),
  });

  return (
    <form>
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
    </form>
  )
}
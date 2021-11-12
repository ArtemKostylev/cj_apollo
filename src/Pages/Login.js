import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../scripts/use-auth.js";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../scripts/mutations";
import "../styles/Login.css";
import { Button } from "../components/shared/ui/Button";
import { FormInput } from "../components/shared/ui/FormInput";
import { FormWrapper } from "../components/shared/ui/FormWrapper";
import { Subtitle } from "../components/shared/ui/Subtitle";

const Login = () => {
  let history = useHistory();
  let auth = useAuth();

  const [formState, setFormState] = useState({
    login: "",
    password: "",
  });

  const login = (e) => {
    mutate();
  };

  const [mutate] = useMutation(LOGIN_MUTATION, {
    variables: {
      login: formState.login.trim().toLowerCase(),
      password: formState.password.trim(),
    },
    onCompleted: (payload) => {
      auth.signin(payload.signin, () => {
        history.push("/");
      });
    },
    onError: (error) => {
      if (error.message === "No such user found")
        alert("Неправильное имя пользователя");
      if (error.message === "Invalid password")
        alert("Неправильно введен пароль");
      else alert("Сервер недоступен");
    },
  });

  return (
    <div className="login">
      <h1>Добро пожаловать!</h1>
      <Subtitle>Пожалуйста введите логин и пароль</Subtitle>
      <FormWrapper>
        <FormInput
          value={formState.login}
          onChange={(e) =>
            setFormState({ ...formState, login: e.target.value })
          }
          type="text"
          name="email"
          autoComplete="email"
          size="30"
          placeholder="Логин"
        />
        <FormInput
          placeholder="Пароль"
          type="password"
          value={formState.password}
          autoComplete="new-password"
          size="30"
          onChange={(e) =>
            setFormState({ ...formState, password: e.target.value })
          }
        />
        <Button onClick={() => login()} text="Войти" />
      </FormWrapper>
    </div>
  );
};

export default Login;

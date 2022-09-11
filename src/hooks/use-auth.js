import React, { useState, useContext, createContext } from 'react';
import { USER_ALIAS } from '../constants/localStorageAliases';

const AuthContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const cashed_user = localStorage.getItem(USER_ALIAS);

  const [user, setUser] = useState(
    cashed_user ? JSON.parse(cashed_user) : null
  );

  const signin = (payload, nav) => {
    const newUser = {
      ...payload.user,
      courses: payload.user.teacher
        ? payload.user.teacher.relations.map((item) => item.course)
        : [],
      teacher: payload.user.teacher ? payload.user.teacher.id : null,
      token: payload.token,
    };
    setUser(newUser);
    localStorage.setItem(USER_ALIAS, JSON.stringify(newUser));
    nav();
  };

  const signout = (nav) => {
    setUser(false);
    localStorage.removeItem(USER_ALIAS);
    nav();
  };

  return {
    user,
    signin,
    signout,
  };
}

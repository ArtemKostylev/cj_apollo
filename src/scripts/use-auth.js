import React, { useState, useContext, createContext } from "react";
import { USER } from "../scripts/constants.js";

const AuthContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const cashed_user = localStorage.getItem(USER);

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
    console.log(newUser);
    setUser(newUser);
    localStorage.setItem(USER, JSON.stringify(newUser));
    nav();
  };

  const signout = (nav) => {
    setUser(false);
    localStorage.removeItem(USER);
    nav();
  };

  return {
    user,
    signin,
    signout,
  };
}

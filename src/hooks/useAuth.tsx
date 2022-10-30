import React, {useState, useContext, createContext} from 'react';
import {USER_ALIAS} from '../constants/localStorageAliases';
import {fromPairs} from 'lodash';
import moment from 'moment';
import {getYearByMonth} from '../utils/academicDate';

type signInCallback = (payload: AuthPayload, nav: () => void) => void;
type signOutCallback = (nav: () => void) => void;
type AuthContextProps = {
  user: {
    role: string;
    versions: Record<string, { id: number, courses: Course[] }>;
    token: string;
  };
  signIn: signInCallback;
  signOut: signOutCallback;
}

const AuthContext = createContext({} as AuthContextProps);

export function ProvideAuth({children}: PrimitiveComponentProps) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth(): AuthContextProps {
  const cashed_user = localStorage.getItem(USER_ALIAS);

  const [user, setUser] = useState(() => {
    const userObj = cashed_user ? JSON.parse(cashed_user) : undefined;
    if (userObj?.role?.name) {
      localStorage.removeItem(USER_ALIAS);
      return undefined;   // Old version of user object detection
    }
    return userObj
  })

  const signIn: signInCallback = (payload, nav) => {
    const versions = fromPairs(payload.user.teacher?.map(it => [it.freezeVersion?.year || getYearByMonth(moment().month()),
      {
        id: it.id,
        courses: it.relations.map(it => it.course)
      }
    ]));

    const newUser = {
      role: payload.user.role.name,
      versions,
      token: payload.token,
    };

    setUser(newUser);
    localStorage.setItem(USER_ALIAS, JSON.stringify(newUser));
    nav();
  };

  const signOut: signOutCallback = (nav) => {
    setUser(undefined);
    localStorage.removeItem(USER_ALIAS);
    nav();
  };

  return {
    user,
    signIn,
    signOut,
  };
}

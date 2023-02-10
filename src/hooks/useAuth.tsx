import React, {useState, useContext, createContext, useMemo, useEffect} from 'react';
import {USER_ALIAS} from '../constants/localStorageAliases';
import {fromPairs} from 'lodash';
import {getCurrentAcademicYear} from '../utils/academicDate';
import {useHistory} from 'react-router-dom';
import {ROUTES} from '../constants/routes';
import {useQuery} from '@apollo/client';
import {UPDATE_USER_INFO} from '../graphql/queries/updateUserInfo';

type signInCallback = (payload: AuthPayload, nav: () => void) => void;
type signOutCallback = (nav: () => void) => void;

interface IUser {
  role: string;
  versions: Record<string, { id: number, courses: Course[] }>;
  token: string;
};
type AuthContextProps = {
  loading: boolean;
  user: IUser;
  signIn: signInCallback;
  signOut: signOutCallback;
}

const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({children}: PrimitiveComponentProps) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth(): AuthContextProps {
  const history = useHistory();
  const cashedUser = useMemo(() => {
    try {
      const storageItem = localStorage.getItem(USER_ALIAS);
      if (!storageItem) {
        history.replace(ROUTES.LOGIN);
        return;
      }
      return JSON.parse(storageItem);
    } catch (e) {
      history.replace(ROUTES.LOGIN);
    }
  }, []);

  const [user, setUser] = useState<IUser | null>(cashedUser);
  const {loading} = useQuery(UPDATE_USER_INFO, {
    variables: {
      token: cashedUser?.token
    },
    onError: () => {
      history.replace(ROUTES.LOGIN)
    },
    onCompleted: (data) => {
      signIn(data.updateUserInfo, () => history.push('/'))
    }
  });

  const signIn: signInCallback = (payload, nav) => {
    if (!payload?.user?.role) {
      localStorage.clear();
      return;
    }

    const versions = fromPairs(payload.user.teacher?.map(it => [it.freezeVersion?.year || getCurrentAcademicYear(),
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
    nav();
    setUser(null);
    localStorage.removeItem(USER_ALIAS);
  };

  return {
    loading,
    user: user as IUser,
    signIn,
    signOut,
  };
}

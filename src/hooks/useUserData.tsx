import {
    useState,
    useContext,
    createContext,
    useMemo,
    type PropsWithChildren
} from 'react';
import { USER_ALIAS } from '../constants/localStorageAliases';
import { UserData, userDataSchema } from '~/models/userData';

interface AuthContextType {
    userData: UserData;
    isAuthenticated: boolean;
    logIn: (userData: UserData) => void;
    logOut: () => void;
}

const AuthContext = createContext({} as AuthContextType);

export const UserDataProvider = ({ children }: PropsWithChildren) => {
    const cashedUser = useMemo(() => {
        try {
            const storageItem = localStorage.getItem(USER_ALIAS);
            if (!storageItem) {
                return undefined;
            }
            const userCache = JSON.parse(storageItem);
            return userDataSchema.parse(userCache);
        } catch (e) {
            return undefined;
        }
    }, []);

    const [userData, setUserData] = useState<UserData | undefined>(cashedUser);
    const isAuthenticated = !!userData;

    const logIn = (userData: UserData) => {
        setUserData(userData);
        localStorage.setItem(USER_ALIAS, JSON.stringify(userData));
    };

    const logOut = () => {
        setUserData(undefined);
        localStorage.removeItem(USER_ALIAS);
    };

    const contextValue = {
        userData: userData || ({} as UserData),
        isAuthenticated,
        logIn,
        logOut
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUserData = () => {
    return useContext(AuthContext);
};

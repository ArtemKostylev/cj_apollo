import { useQuery } from '@tanstack/react-query';
import { useState, useContext, createContext, useMemo, type PropsWithChildren, useLayoutEffect } from 'react';
import { getUserData } from '~/api/user';
import { PageLoader } from '~/components/pageLoader';
import { UserData } from '~/models/userData';

interface AuthContextType {
    userData: UserData;
    isAuthenticated: boolean;
    logIn: (userData: UserData) => void;
    logOut: () => void;
}

const AuthContext = createContext({} as AuthContextType);

export const UserDataProvider = ({ children }: PropsWithChildren) => {
    const [userData, setUserData] = useState<UserData | undefined>(undefined);
    const [authenticated, setAuthenticated] = useState(false);

    const { isLoading } = useQuery({
        queryKey: ['userData'],
        queryFn: async () => {
            const data = await getUserData();
            setUserData(data);
            setAuthenticated(true);
        }
    });

    const logIn = (data: UserData) => {
        setAuthenticated(true);
        setUserData({ ...data });
    };

    const logOut = () => {
        setUserData(undefined);
        setAuthenticated(false);
    };

    const contextValue = useMemo(
        () => ({
            userData: userData || ({} as UserData),
            isAuthenticated: authenticated,
            logIn,
            logOut
        }),
        [userData, authenticated]
    );

    return (
        <PageLoader loading={isLoading} error={false}>
            <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
        </PageLoader>
    );
};

export const useUserData = () => {
    return useContext(AuthContext);
};

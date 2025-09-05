import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { UserDataProvider, useUserData } from '~/hooks/useUserData';
import { setContext } from '@apollo/client/link/context';
import { USER_ALIAS } from '~/constants/localStorageAliases';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '~/utils/router';
import { RouterProvider } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';

import 'react-datepicker/dist/react-datepicker.css';
import '~/styles/index.css';
import '~/styles/colors.css';
import '~/styles/typography.css';

const authLink = setContext((_, { headers }) => {
    const user = JSON.parse(localStorage.getItem(USER_ALIAS) as string);
    const token = user ? user.token : false;
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ''
        }
    };
});

const httpLink = ApolloLink.from([authLink, new HttpLink({ uri: 'http://localhost:4000/graphql' })]);

const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false
        }
    }
});

const toastOptions = {
    error: {
        style: {
            backgroundColor: '#FF7C01',
            color: 'white'
        },
        iconTheme: {
            primary: 'white',
            secondary: '#FF7C01'
        }
    }
};

const InnerApp = () => {
    const { isAuthenticated, userData } = useUserData();
    return <RouterProvider router={router} context={{ isAuthenticated, role: userData?.role }} />;
};

export default function App() {
    return (
        <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={queryClient}>
                <UserDataProvider>
                    <InnerApp />
                    <Toaster position="bottom-center" toastOptions={toastOptions} />
                </UserDataProvider>
            </QueryClientProvider>
        </ApolloProvider>
    );
}

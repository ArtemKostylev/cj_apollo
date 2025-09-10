import { UserDataProvider, useUserData } from '~/hooks/useUserData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '~/utils/router';
import { RouterProvider } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';

import 'react-datepicker/dist/react-datepicker.css';
import '~/styles/index.css';
import '~/styles/colors.css';
import '~/styles/typography.css';

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
        <QueryClientProvider client={queryClient}>
            <UserDataProvider>
                <InnerApp />
                <Toaster position="bottom-center" toastOptions={toastOptions} />
            </UserDataProvider>
        </QueryClientProvider>
    );
}

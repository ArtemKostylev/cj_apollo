import axios, { type AxiosError } from 'axios';
import { router } from '~/utils/router';
import { Route as ForbiddenRoute } from '~/routes/forbidden';
import { Route as LoginRoute } from '~/routes/login';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true
});

const errorInterceptor = (error: AxiosError) => {
    if (error.response?.status === 401) {
        const search = {
            redirect: router.state.location.pathname === ForbiddenRoute.fullPath ? '/' : router.state.location.pathname
        };
        router.navigate({ to: LoginRoute.fullPath, search });
    }

    if (error.response?.status === 403) {
        router.navigate({ to: ForbiddenRoute.fullPath });
    }

    if (error.response?.status === 500 || error.response?.status === 400) {
        return Promise.reject({
            error: error,
            message: (error.response?.data as { message?: string })?.message
        });
    }

    return Promise.reject(error);
};

axiosInstance.interceptors.response.use(undefined, errorInterceptor);

export const httpClient = axiosInstance;

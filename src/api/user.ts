import type { UserData } from '~/models/userData';
import { httpClient } from './httpClient';

interface LogInRequestDto {
    login: string;
    password: string;
}

export async function login(request: LogInRequestDto): Promise<UserData> {
    const response = await httpClient.post('/user/login', request);
    return response.data;
}

export async function logout(): Promise<void> {
    await httpClient.post('/user/logout');
}

export async function getUserData(): Promise<UserData> {
    const response = await httpClient.get('/user/data');
    return response.data;
}

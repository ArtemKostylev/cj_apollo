import type { UserData } from '~/models/userData';
import { httpClient } from './httpClient';
import type { User } from '~/models/user';
import type { OffsetResponse } from '~/models/offsetResponse';
import type { DropdownOptionType } from '~/models/dropdownOption';

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

export async function getUsers(limit: number, offset: number): Promise<OffsetResponse<User>> {
    const response = await httpClient.get(`/user/list`, {
        params: {
            limit,
            offset
        }
    });
    return response.data;
}

export async function getUserOptions(): Promise<DropdownOptionType[]> {
    const response = await httpClient.get('/user/options');
    return response.data;
}

interface RegisterRequestDto {
    login: string;
    password: string;
    role: string;
}

export async function registerUser(params: RegisterRequestDto) {
    await httpClient.post('/user/register', params);
}

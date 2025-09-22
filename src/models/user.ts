export interface User extends Record<string, unknown> {
    id: number;
    login: string;
    role: number;
}

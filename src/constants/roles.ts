export const ROLES = {
    TEACHER: '2',
    ADMIN: '1'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

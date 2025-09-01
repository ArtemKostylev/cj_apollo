import { redirect } from '@tanstack/react-router';
import type { Role } from '~/constants/roles';
import type { RouterContext } from '~/models/routerContext';
import { Route as LoginRoute } from '~/routes/login';

export const beforeProtectedRouteLoad = (
    context: RouterContext,
    to: string,
    roles: Role[]
) => {
    if (
        !context.isAuthenticated ||
        !roles.includes(String(context.role) as Role)
    ) {
        throw redirect({
            to: LoginRoute.fullPath,
            search: {
                redirect: to
            }
        });
    }
};

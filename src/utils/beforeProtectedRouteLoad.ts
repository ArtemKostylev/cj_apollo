import { redirect } from '@tanstack/react-router';
import type { Role } from '~/constants/roles';
import type { RouterContext } from '~/models/routerContext';
import { Route as LoginRoute } from '~/routes/login';
import { Route as ForbiddenRoute } from '~/routes/forbidden';

export const beforeProtectedRouteLoad = (context: RouterContext, to: string, roles: Role[]) => {
    if (!context.isAuthenticated) {
        throw redirect({
            to: LoginRoute.fullPath,
            search: {
                redirect: to
            }
        });
    } else if (!roles.includes(String(context.role) as Role)) {
        throw redirect({
            to: ForbiddenRoute.fullPath,
            search: {}
        });
    }
};

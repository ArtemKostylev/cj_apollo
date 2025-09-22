import { createFileRoute } from '@tanstack/react-router';
import { Users } from '~/pages/users';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import { ROLES } from '~/constants/roles';

export const Route = createFileRoute('/_main/users')({
    component: Users,
    beforeLoad: ({ context, location }) => beforeProtectedRouteLoad(context, location.href, [ROLES.ADMIN])
});

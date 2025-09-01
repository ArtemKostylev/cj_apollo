import { createFileRoute } from '@tanstack/react-router';
import { ROLES } from '~/constants/roles';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import { Subgroups } from '~/pages/subgroups';

export const Route = createFileRoute('/_main/subgroups')({
    component: Subgroups,
    beforeLoad: ({ context, location }) =>
        beforeProtectedRouteLoad(context, location.href, [
            ROLES.TEACHER,
            ROLES.ADMIN
        ])
});
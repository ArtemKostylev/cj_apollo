import { createFileRoute } from '@tanstack/react-router';
import { ROLES } from '~/constants/roles';
import { Compensation } from '~/pages/compensation';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';

export const Route = createFileRoute('/_main/compensation')({
    component: Compensation,
    beforeLoad: ({ context, location }) =>
        beforeProtectedRouteLoad(context, location.href, [
            ROLES.TEACHER,
            ROLES.ADMIN
        ])
});
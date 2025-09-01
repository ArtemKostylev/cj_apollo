import { createFileRoute } from '@tanstack/react-router';
import { ROLES } from '~/constants/roles';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import { Reports } from '~/pages/admin/ReportsPage/Reports';

export const Route = createFileRoute('/_main/reports')({
    component: Reports,
    beforeLoad: ({ context, location }) =>
        beforeProtectedRouteLoad(context, location.href, [ROLES.ADMIN])
});

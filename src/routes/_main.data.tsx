import { createFileRoute } from '@tanstack/react-router';
import { ROLES } from '~/constants/roles';
import { Relations } from '~/pages/relations';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';

export const Route = createFileRoute('/_main/data')({
    component: Relations,
    beforeLoad: ({ context, location }) => beforeProtectedRouteLoad(context, location.href, [ROLES.ADMIN])
});

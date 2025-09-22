import { createFileRoute } from '@tanstack/react-router';
import { Teachers } from '~/pages/teachers';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import { ROLES } from '~/constants/roles';

export const Route = createFileRoute('/_main/teachers')({
    component: Teachers,
    beforeLoad: ({ context, location }) => beforeProtectedRouteLoad(context, location.href, [ROLES.ADMIN])
});

import { createFileRoute } from '@tanstack/react-router';
import { ROLES } from '~/constants/roles';
import { Journal } from '~/pages/journal';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';

export const Route = createFileRoute('/_main/journal')({
    component: Journal,
    beforeLoad: ({ context, location }) =>
        beforeProtectedRouteLoad(context, location.href, [
            ROLES.TEACHER,
            ROLES.ADMIN
        ])
});

import { createFileRoute } from '@tanstack/react-router';
import { ROLES } from '~/constants/roles';
import { Courses } from '~/pages/courses';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';

export const Route = createFileRoute('/_main/courses')({
    component: Courses,
    beforeLoad: ({ context, location }) => beforeProtectedRouteLoad(context, location.href, [ROLES.ADMIN])
});

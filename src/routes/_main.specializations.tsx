import { createFileRoute } from '@tanstack/react-router';
import { ROLES } from '~/constants/roles';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import { Specialization } from '~/pages/specialization';

export const Route = createFileRoute('/_main/specializations')({
    component: Specialization,
    beforeLoad: ({ context, location }) => beforeProtectedRouteLoad(context, location.href, [ROLES.ADMIN])
});

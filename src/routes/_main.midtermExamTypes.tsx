import { createFileRoute } from '@tanstack/react-router';
import { ROLES } from '~/constants/roles';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import { MidtermExamTypes } from '~/pages/admin/MidtermExamTypes';

export const Route = createFileRoute('/_main/midtermExamTypes')({
    component: MidtermExamTypes,
    beforeLoad: ({ context, location }) =>
        beforeProtectedRouteLoad(context, location.href, [ROLES.ADMIN])
});


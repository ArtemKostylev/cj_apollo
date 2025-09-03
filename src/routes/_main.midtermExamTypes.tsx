import { createFileRoute } from '@tanstack/react-router';
import { ROLES } from '~/constants/roles';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import { MidtermExamType } from '~/pages/midtermExamType';

export const Route = createFileRoute('/_main/midtermExamTypes')({
    component: MidtermExamType,
    beforeLoad: ({ context, location }) => beforeProtectedRouteLoad(context, location.href, [ROLES.ADMIN])
});

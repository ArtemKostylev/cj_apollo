import { createFileRoute } from '@tanstack/react-router';
import { ROLES } from '~/constants/roles';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import { MidtermExam } from '~/pages/midtermExam';

export const Route = createFileRoute('/_main/midtermExam')({
    component: MidtermExam,
    beforeLoad: ({ context, location }) =>
        beforeProtectedRouteLoad(context, location.href, [ROLES.TEACHER, ROLES.ADMIN])
});

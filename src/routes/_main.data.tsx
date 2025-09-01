import { createFileRoute } from '@tanstack/react-router';
import { ROLES } from '~/constants/roles';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import DataPageController from '~/pages/admin/DataPage/DataPageApollo';

export const Route = createFileRoute('/_main/data')({
    component: DataPageController,
    beforeLoad: ({ context, location }) =>
        beforeProtectedRouteLoad(context, location.href, [ROLES.ADMIN])
});

import { createFileRoute } from '@tanstack/react-router'
import { ROLES } from '~/constants/roles';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import { GroupConsult } from '~/pages/groupConsult';

export const Route = createFileRoute('/_main/groupConsult')({
  component: GroupConsult,
  beforeLoad: ({ context, location }) =>
    beforeProtectedRouteLoad(context, location.href, [
      ROLES.TEACHER,
      ROLES.ADMIN
    ])
})

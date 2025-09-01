import { createFileRoute } from '@tanstack/react-router'
import { ROLES } from '~/constants/roles';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import { Consult } from '~/pages/consult';

export const Route = createFileRoute('/_main/consult')({
  component: Consult,
  beforeLoad: ({ context, location }) =>
    beforeProtectedRouteLoad(context, location.href, [
      ROLES.TEACHER,
      ROLES.ADMIN
    ])
})

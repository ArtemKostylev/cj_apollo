import { createFileRoute } from '@tanstack/react-router'
import { ROLES } from '~/constants/roles'
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad'
import { Notes } from '~/pages/notes';

export const Route = createFileRoute('/_main/notes')({
  component: Notes,
  beforeLoad: ({ context, location }) =>
    beforeProtectedRouteLoad(context, location.href, [
      ROLES.TEACHER,
      ROLES.ADMIN
    ])
});


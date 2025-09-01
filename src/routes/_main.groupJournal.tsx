import { createFileRoute } from '@tanstack/react-router'
import { ROLES } from '~/constants/roles';
import { beforeProtectedRouteLoad } from '~/utils/beforeProtectedRouteLoad';
import { GroupJournal } from '~/pages/groupJournal';

export const Route = createFileRoute('/_main/groupJournal')({
  component: GroupJournal,
  beforeLoad: ({ context, location }) =>
    beforeProtectedRouteLoad(context, location.href, [
      ROLES.TEACHER,
      ROLES.ADMIN
    ])
});


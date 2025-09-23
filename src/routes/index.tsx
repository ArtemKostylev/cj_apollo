import { createFileRoute, redirect } from '@tanstack/react-router';
import { ROLES, type Role } from '~/constants/roles';
import { Route as JournalRoute } from './_main.journal';
import { Route as SpecializationsRoute } from './_main.specializations';
import { Route as LoginRoute } from './login';
import { MainLayout } from '~/components/mainLayout1';

export const Route = createFileRoute('/')({
    component: MainLayout,
    loader: ({ context, location }) => {
        if (context.isAuthenticated) {
            const role = String(context.role) as Role;
            if (role === ROLES.TEACHER) {
                return redirect({
                    to: JournalRoute.fullPath,
                    search: {}
                });
            } else if (role === ROLES.ADMIN) {
                // TODO: replace redirect with correct route
                return redirect({
                    to: SpecializationsRoute.fullPath,
                    search: {}
                });
            }
        } else {
            return redirect({
                to: LoginRoute.fullPath,
                search: {
                    redirect: location.href
                }
            });
        }
    }
});

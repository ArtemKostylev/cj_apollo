import { createFileRoute, redirect } from '@tanstack/react-router';
import { ROLES, type Role } from '~/constants/roles';
import { Route as JournalRoute } from './_main.journal';
import { Route as DataRoute } from './_main.data';
import { Route as LoginRoute } from './login';
import { MainLayout } from '~/components/mainLayout';

export const Route = createFileRoute('/')({
    component: MainLayout,
    loader: ({ context, location }) => {
        if (context.isAuthenticated) {
            const role = String(context.role) as Role;
            if (role === ROLES.TEACHER) {
                return redirect({
                    to: JournalRoute.fullPath,
                    search: {
                        redirect: location.href
                    }
                });
            } else if (role === ROLES.ADMIN) {
                return redirect({
                    to: DataRoute.fullPath,
                    search: {
                        redirect: location.href
                    }
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

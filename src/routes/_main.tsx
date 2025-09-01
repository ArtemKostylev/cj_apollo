import { createFileRoute, Outlet } from '@tanstack/react-router';
import { MainLayout } from '~/components/mainLayout';

export const Route = createFileRoute('/_main')({
    component: MainLayout
});

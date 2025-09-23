import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '~/components/mainLayout1';

export const Route = createFileRoute('/_main')({
    component: MainLayout
});

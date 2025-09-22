import { createFileRoute } from '@tanstack/react-router';
import { Students } from '~/pages/students';

export const Route = createFileRoute('/_main/students')({
    component: Students
});

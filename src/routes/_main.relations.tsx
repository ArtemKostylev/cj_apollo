import { createFileRoute } from '@tanstack/react-router';
import { Relations } from '~/pages/relations';

export const Route = createFileRoute('/_main/relations')({
    component: Relations
});

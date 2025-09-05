import { createFileRoute } from '@tanstack/react-router';
import { Forbidden } from '~/pages/forbidden';

export const Route = createFileRoute('/forbidden')({
    component: Forbidden
});

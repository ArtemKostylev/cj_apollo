import { createRouter } from '@tanstack/react-router';
import { routeTree } from '~/routeTree.gen';

export const router = createRouter({
    routeTree,
    basepath: import.meta.env.VITE_BASE_URL || '/',
    context: {
        isAuthenticated: false,
        role: undefined
    }
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

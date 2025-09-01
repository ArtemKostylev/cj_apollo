import { createRootRouteWithContext } from '@tanstack/react-router';
import type { RouterContext } from '~/models/routerContext';
import { Outlet } from '@tanstack/react-router';

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => {
        return <Outlet />;
    }
});

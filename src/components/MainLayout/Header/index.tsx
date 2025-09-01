import { MouseEventHandler, RefObject } from 'react';
import { useUserData } from '~/hooks/useUserData';
import {
    ADMIN_RESOURCES,
    SUBGROUPS_RESOURCE,
    USER_RESOURCES
} from '~/constants/resources';
import styles from './header.module.css';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Route as LoginRoute } from '~/routes/login';
import { useMutation } from '@tanstack/react-query';
import { logout } from '~/api/user';

function getHeaderFromRoute(pathname: string) {
    const key = pathname.replace('/', '');

    const route =
        USER_RESOURCES[key] || ADMIN_RESOURCES[key] || SUBGROUPS_RESOURCE;
    return route.title.toUpperCase() || 'КЛАССНЫЙ ЖУРНАЛ';
}

type Props = {
    onMenuClick: MouseEventHandler<HTMLDivElement>;
    menuRef: RefObject<any>;
};

export const Header = ({ onMenuClick, menuRef }: Props) => {
    let navigate = useNavigate();
    const { logOut } = useUserData();
    const location = useLocation();

    const { mutate: logoutMutation } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            logOut();
            navigate({ to: LoginRoute.fullPath });
        }
    });

    return (
        <div className={styles.header}>
            <div
                onClick={onMenuClick}
                className={styles.menuButton}
                ref={menuRef}
            >
                МЕНЮ
            </div>
            <div className={styles.headerTitle}>
                <h1>{getHeaderFromRoute(location.pathname)}</h1>
            </div>
            <div className={styles.exitButton} onClick={() => logoutMutation()}>
                Выйти
            </div>
        </div>
    );
};

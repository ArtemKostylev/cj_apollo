import { useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorScreen } from '~/pages/error';
import Menu from '~/components/menu';
import classNames from 'classnames';
import styles from './mainLayout.module.css';
import { Header } from './Header';
import { Outlet } from '@tanstack/react-router';

export const MainLayout = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const onMenuClick = () => {
        setMenuVisible((prev) => !prev);
    };

    const coverClassName = classNames(styles.cover, {
        [styles.visible]: menuVisible
    });

    return (
        <div className={styles.appWrapper}>
            <ErrorBoundary fallbackRender={(props) => <ErrorScreen {...props} />}>
                <Menu isOpen={menuVisible} onClose={() => setMenuVisible((prev) => !prev)} />
                <div className={coverClassName} onClick={() => setMenuVisible((prev) => !prev)} />
                <div className={styles.content}>
                    <Header onMenuClick={onMenuClick} menuRef={menuRef} />
                    <Outlet />
                </div>
            </ErrorBoundary>
        </div>
    );
};

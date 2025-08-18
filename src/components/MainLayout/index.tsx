import { useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorScreen } from '~/Pages/ErrorScreen';
import Menu from '~/components/Menu';
import { AppRouter } from '~/MainRouter';
import classNames from 'classnames';
import styles from './mainLayout.module.css';
import Header from './Header';

export const MainLayout = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const onMenuClick = () => {
        setMenuVisible((prev) => !prev);
    };

    const coverClassName = classNames(styles.cover, {
        [styles.visible]: menuVisible
    });

    const contentClassName = classNames(styles.content, {
        [styles.visible]: menuVisible
    });

    return (
        <div className={styles.appWrapper}>
            <ErrorBoundary FallbackComponent={ErrorScreen}>
                <Menu
                    isOpen={menuVisible}
                    onClose={() => setMenuVisible((prev) => !prev)}
                />
                <div
                    className={coverClassName}
                    onClick={() => setMenuVisible((prev) => !prev)}
                />
                <div className={contentClassName}>
                    <Header onMenuClick={onMenuClick} menuRef={menuRef} />
                    <AppRouter />
                </div>
            </ErrorBoundary>
        </div>
    );
};

import { useUserData } from '~/hooks/useUserData';
import { ADMIN_RESOURCES, USER_RESOURCES, SUBGROUPS_RESOURCE, GROUP_JOURNAL_RESOURCE } from '~/constants/resources';
import { ROLES } from '~/constants/roles';
import { getCurrentAcademicYear } from '~/utils/academicDate';
import { useMemo } from 'react';
import { MenuItem } from '~/components/menu/MenuItem';
import styles from './menu.module.css';
import classNames from 'classnames';

const resourceMap: Record<string, any> = {
    [ROLES.ADMIN]: ADMIN_RESOURCES,
    [ROLES.TEACHER]: USER_RESOURCES
};

interface Props {
    onClose: () => void;
    isOpen: boolean;
}

export default function Menu({ onClose, isOpen }: Props) {
    const { userData } = useUserData();
    const academicYear = getCurrentAcademicYear();

    const resources = useMemo(() => {
        if (!userData || !userData.role) return undefined;
        const res = resourceMap[userData?.role];

        if (userData.versions[academicYear]?.groupCourses.length > 0 && userData.role === Number(ROLES.TEACHER)) {
            res.subgroups = SUBGROUPS_RESOURCE;
            res.groupJournal = GROUP_JOURNAL_RESOURCE;
        }

        return res;
    }, [userData]);

    const className = classNames(styles.menuWrapper, {
        [styles.visible]: isOpen
    });

    const firstMenuItemClassName = classNames(styles.menuItemWrapper, styles.disableHover);

    if (!resources) return null;

    return (
        <div className={className}>
            <div className={firstMenuItemClassName}>
                <p className={styles.menuItemText}>МЕНЮ</p>
                <div className={styles.menuCloseButton} onClick={onClose}>
                    Закрыть
                </div>
            </div>
            {Object.keys(resources)
                .sort((a, b) => resources[a].order - resources[b].order)
                .map((key) => (
                    <MenuItem {...resources[key]} key={key} onClose={onClose} />
                ))}
        </div>
    );
}

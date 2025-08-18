import { useUserData } from '~/hooks/useUserData';
import {
    ADMIN_RESOURCES,
    USER_RESOURCES,
    SUBGROUPS_RESOURCE
} from '~/constants/resources';
import { ADMIN, TEACHER } from '~/constants/roles';
import { t } from '~/static/text';
import { getCurrentAcademicYear } from '~/utils/academicDate';
import { useMemo } from 'react';
import { MenuItem } from './MenuItem';
import styles from './menu.module.css';

const resourceMap: Record<string, any> = {
    [ADMIN]: ADMIN_RESOURCES,
    [TEACHER]: USER_RESOURCES
};

interface Props {
    onClose: () => void;
    isOpen: boolean;
}

export default function Menu({ onClose, isOpen }: Props) {
    const auth = useUserData();

    const resources = useMemo(() => {
        const res = resourceMap[auth.user?.role];

        if (
            auth.user?.versions[getCurrentAcademicYear()]?.courses.some(
                (course) => course.group
            )
        ) {
            res.subgroups = SUBGROUPS_RESOURCE;
        }

        return res;
    }, [auth.user]);

    if (!resources) return null;

    return (
        <div className={styles.menuWrapper}>
            <div className={styles.menuItemWrapper}>
                <p className={styles.menuItemText}>МЕНЮ</p>
                <div className={styles.menuCloseButton} onClick={onClose}>
                    {t('close')}
                </div>
            </div>
            {Object.keys(resources).map((key) => (
                <MenuItem {...resources[key]} key={key} onClose={onClose} />
            ))}
        </div>
    );
}

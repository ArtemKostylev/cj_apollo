import { Link } from '@tanstack/react-router';
import styles from './menu.module.css';

interface Props {
    path: string;
    onClose: () => void;
    title: string;
}

export const MenuItem = ({ path, onClose, title }: Props) => {
    return (
        <div className={styles.menuItemWrapper} key={path}>
            <Link className={styles.menuItemLink} to={path} onClick={onClose}>
                <p className={styles.menuItemText}>{title}</p>
            </Link>
        </div>
    );
};

import { Link } from '@tanstack/react-router';
import styles from './menu.module.css';
import classNames from 'classnames';

interface Props {
    path: string;
    onClose: () => void;
    title: string;
}

export const MenuItem = ({ path, onClose, title }: Props) => {
    const className = classNames(styles.menuItemWrapper, styles.clickable);
    return (
        <div className={className } key={path}>
            <Link className={styles.menuItemLink} to={path} onClick={onClose} search={{}}>
                <p className={styles.menuItemText}>{title}</p>
            </Link>
        </div>
    );
};

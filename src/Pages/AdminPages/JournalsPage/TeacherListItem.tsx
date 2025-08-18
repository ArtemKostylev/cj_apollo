import classNames from 'classnames';
import styles from './journals.module.css';
interface Props {
    onClick: () => void;
    active: boolean;
    teacherName: string;
}

export const TeacherListItem = (props: Props) => {
    const { onClick, active, teacherName } = props;

    const className = classNames({
        [styles.active]: active
    });
    return (
        <li tabIndex={0} onClick={onClick} className={className}>
            <p>{teacherName}</p>
        </li>
    );
};

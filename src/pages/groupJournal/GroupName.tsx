import styles from './groupJournal.module.css';

export const GroupName = ({ group }: { group: string }) => {
    const [classTitle, classValue, groupTitle, groupValue] = group.split(' ');

    return (
        <div className={styles.groupName}>
            <div>
                {classTitle} <span className={styles.bold}>{classValue}</span>
            </div>
            <div>
                {groupTitle} <span className={styles.bold}>{groupValue}</span>
            </div>
        </div>
    );
};

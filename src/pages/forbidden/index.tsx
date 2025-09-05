import styles from './styles/forbidden.module.css';

export function Forbidden() {
    return (
        <div className={styles.forbidden}>
            <div className={styles.title}>
                <h1 className={styles.code}>403 &nbsp;</h1>
                <h1 className={styles.text}>Стоп! Сюда нельзя!</h1>
            </div>
            <h2>Данная страница недоступна для вашей роли!</h2>
        </div>
    )
}
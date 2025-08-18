import type { FallbackProps } from 'react-error-boundary';
import styles from './styles.module.css';

export const ErrorScreen = ({ error }: FallbackProps) => {
    let displayCode;
    let displayMessage;

    switch (error.message) {
        case '503':
            displayCode = 503;
            displayMessage = 'К сожалению, сервер не доступен.';
            break;
        default:
            displayCode = 404;
            displayMessage = 'Ошибка';
            break;
    }
    console.log(error.message);
    return (
        <div className={styles.errorContainer}>
            <h1 className={styles.errorCode}>{displayCode}</h1>
            <p className={styles.errorMessage}>{displayMessage}</p>
        </div>
    );
};

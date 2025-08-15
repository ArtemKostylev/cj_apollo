import styles from './controlButton.module.css';
import controlStyles from '../tableControls.module.css';

interface Props {
    disabled?: boolean;
    onClick?: (param: any) => void;
    text?: string;
}

export const ControlButton = (props: Props) => {
    const { disabled, text, onClick } = props;

    return (
        <div className={controlStyles.controlItem}>
            <button
                className={styles.controlButton}
                disabled={disabled}
                onClick={onClick}
            >
                {text}
            </button>
        </div>
    );
};

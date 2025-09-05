import controlStyles from '../tableControls.module.css';
import { Button, BUTTON_THEMES } from '~/components/button';

interface Props {
    loading?: boolean;
    disabled?: boolean;
    onClick?: (param: any) => void;
    text?: string;
}

export const ControlButton = (props: Props) => {
    const { disabled, text, onClick, loading } = props;

    return (
        <div className={controlStyles.controlItem}>
            <Button disabled={disabled} onClick={onClick} loading={loading} theme={BUTTON_THEMES.CONTROL}>
                {text}
            </Button>
        </div>
    );
};

import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import buttonStyles from './button.module.css';
import buttonThemes from './theme.module.css';
import loaderOverlayStyles from './loaderOverlay.module.css';
import { Spinner } from '../spinner';
import { BUTTON_THEMES, type ButtonTheme } from './buttonTheme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    theme?: ButtonTheme;
}

export const Button = (props: ButtonProps) => {
    const { loading, children, className, theme = BUTTON_THEMES.DEFAULT, ...rest } = props;

    const buttonClassName = classNames(className, buttonStyles.button, {
        [buttonThemes.default]: theme === BUTTON_THEMES.DEFAULT,
        [buttonThemes.control]: theme === BUTTON_THEMES.CONTROL
    });

    const loaderOverlayClassName = classNames(loaderOverlayStyles.loaderOverlay, {
        [loaderOverlayStyles.control]: theme === BUTTON_THEMES.CONTROL
    });

    return (
        <button className={buttonClassName} {...rest}>
            {loading && (
                <div className={loaderOverlayClassName}>
                    <Spinner />
                </div>
            )}
            {children}
        </button>
    );
};

export { BUTTON_THEMES };

import { forwardRef, TextareaHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './textArea.module.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
    const { className, error, ...rest } = props;
    const textAreaClassName = classNames(styles.textArea, className, {
        [styles.error]: error
    });

    return <textarea ref={ref} {...rest} className={textAreaClassName} />;
});

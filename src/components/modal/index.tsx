import { memo, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import overlayStyles from './overlay.module.css';
import modalStyles from './modal.module.css';
import { Close } from '../icon';
import classNames from 'classnames';

interface Props {
    opened: boolean;
    onClose: () => void;
    title: string;
    contentClassName?: string;
}

const ModalBody = memo((props: PropsWithChildren<Props>) => {
    const { children, onClose, title, contentClassName: contentClassNameProp } = props;

    const contentClassName = classNames(modalStyles.content, contentClassNameProp);

    return (
        <div className={overlayStyles.overlay} onClick={onClose}>
            <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={modalStyles.header}>
                    <h2>{title}</h2>
                    <Close onClick={onClose} />
                </div>
                <div className={contentClassName}>{children}</div>
            </div>
        </div>
    );
});

export const Modal = memo((props: PropsWithChildren<Props>) => {
    const { opened } = props;

    if (!opened) return null;

    return createPortal(<ModalBody {...props} />, document.body);
});

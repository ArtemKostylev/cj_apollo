import { IconProps } from './types';
import iconStyles from './icon.module.css';
import classNames from 'classnames';

export function Close(props: IconProps) {
    const { onClick, className: classNameProp } = props;

    const className = classNames(classNameProp, {
        [iconStyles.clickable]: !!onClick
    });

    return (
        <svg
            className={className}
            onClick={onClick}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1.42859 1.42857L12.5714 12.5714"
                stroke="#515356"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.42859 12.5714L12.5714 1.42857"
                stroke="#515356"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

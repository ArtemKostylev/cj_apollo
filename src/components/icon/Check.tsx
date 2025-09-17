import type { IconProps } from './types';

export function Check(props: IconProps) {
    const { onClick, className } = props;

    return (
        <svg
            onClick={onClick}
            className={className}
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_280_124)">
                <path
                    d="M0.5 8.66919L3.23 12.1791C3.32212 12.2988 3.44016 12.3961 3.57525 12.4637C3.71034 12.5312 3.85898 12.5673 4.01 12.5691C4.15859 12.5709 4.3057 12.5394 4.44063 12.4772C4.57555 12.4149 4.6949 12.3233 4.79 12.2091L13.5 1.66919"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_280_124">
                    <rect width="14" height="14" fill="white" transform="translate(0 0.119141)" />
                </clipPath>
            </defs>
        </svg>
    );
}

import { IconProps } from './types';

export function Pencil(props: IconProps) {
    const { onClick, className } = props;

    return (
        <svg
            className={className}
            onClick={onClick}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 13.2401L1.5 14.5001L2.76 10.0001L11 1.80014C11.0931 1.7049 11.2044 1.62922 11.3271 1.57755C11.4499 1.52588 11.5818 1.49927 11.715 1.49927C11.8482 1.49927 11.9801 1.52588 12.1029 1.57755C12.2256 1.62922 12.3369 1.7049 12.43 1.80014L14.2 3.58014C14.2937 3.6731 14.3681 3.78371 14.4189 3.90556C14.4697 4.02742 14.4958 4.15813 14.4958 4.29014C14.4958 4.42215 14.4697 4.55286 14.4189 4.67472C14.3681 4.79658 14.2937 4.90718 14.2 5.00014L6 13.2401Z"
                stroke="#515356"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

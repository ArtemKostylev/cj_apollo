import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useOnClickOutside } from '~/hooks/useOnClickOutside';
import styles from './styles/dropdown.module.css';
import { DropdownOption } from './DropdownOption';

type Props = {
    opened: boolean;
    options: DropdownOptionType[];
    onSelect: (value: string) => void;
    width?: string;
};

export const Dropdown = (props: Props) => {
    const { opened, options, onSelect, width = 'auto' } = props;
    const [inverted, setInverted] = useState(false);
    const [visible, setVisible] = useState(opened);

    const ref = useRef(null);

    useOnClickOutside(ref, () => setVisible(false));

    useEffect(() => {
        const bounds = (ref.current as any).getBoundingClientRect();
        const height =
            window.innerHeight || document.documentElement.clientHeight;

        if (bounds.bottom > height) {
            setInverted(true);
        }
    }, [setInverted, visible]);

    useEffect(() => {
        setVisible(opened);
    }, [opened]);

    const className = classNames(styles.dropdown, {
        [styles.opened]: visible,
        [styles.inverted]: inverted
    });

    return (
        <div className={className} style={{ width }} ref={ref}>
            {options.map((option) => (
                <DropdownOption
                    short={option.short}
                    key={option.value}
                    onClick={() => onSelect(option.value)}
                >
                    {option.text}
                </DropdownOption>
            ))}
        </div>
    );
};

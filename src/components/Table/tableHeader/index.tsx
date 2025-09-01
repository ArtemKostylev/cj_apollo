import { type PropsWithChildren, type ThHTMLAttributes } from 'react';
import styles from './tableHeader.module.css';
import classNames from 'classnames';

interface Props extends ThHTMLAttributes<HTMLTableCellElement> {
    hoverEnabled?: boolean;
    width?: string;
}

export const TableHeader = (props: PropsWithChildren<Props>) => {
    const {
        children,
        hoverEnabled,
        width = 'auto',
        className: classNameProp,
        ...rest
    } = props;

    const className = classNames(styles.tableHeader, classNameProp, {
        [styles.hoverEnabled]: hoverEnabled
    });

    return (
        <th className={className} style={{ width }} {...rest}>
            {children}
        </th>
    );
};

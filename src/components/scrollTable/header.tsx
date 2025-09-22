import type { ReactElement } from 'react';
import { TableHeader } from '../table/tableHeader';
import styles from './scrollTable.module.css';

export interface ScrollTableColumn {
    key: string;
    title: string;
    width?: number;
    render?: (data: unknown, style?: React.CSSProperties) => ReactElement;
}

interface Props {
    columns: ScrollTableColumn[];
}

export const ScrollTableHeader = (props: Props) => {
    const { columns } = props;

    return (
        <table className={styles.headerStyle}>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <TableHeader key={column.key} style={column.width ? { width: `${column.width}px` } : undefined}>
                            {column.title}
                        </TableHeader>
                    ))}
                </tr>
            </thead>
        </table>
    );
};

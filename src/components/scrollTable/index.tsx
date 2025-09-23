import { useVirtualizer } from '@tanstack/react-virtual';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import styles from './scrollTable.module.css';
import { Table } from '../table';
import { ScrollTableHeader, type ScrollTableColumn } from './header';
import { TableCell } from '../cells/tableCell';
import classNames from 'classnames';
import { Spinner } from '../spinner';

interface TableItem {
    id: number;

    [key: string]: unknown;
}

interface Props<T extends TableItem> {
    data: T[];
    columns: ScrollTableColumn[];
    selectedRow?: T;
    onRowClick?: (row: T) => void;
    loading: boolean;
    fetchNextPage: VoidFunction;
    hasNext: boolean;
    rowSize: number;
    hasControls?: boolean;
}

export const ScrollTable = <T extends TableItem>(props: Props<T>) => {
    const { data, loading, fetchNextPage, hasNext, columns, rowSize, selectedRow, onRowClick, hasControls } = props;

    const scrollContainerRef = useRef<HTMLTableElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: hasNext ? data.length + 1 : data.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => rowSize,
        overscan: 5
    });

    const bodyStyle = useMemo(() => {
        return {
            height: `${rowVirtualizer.getTotalSize()}px`
        };
    }, [rowVirtualizer.getTotalSize()]);

    const virtualItems = rowVirtualizer.getVirtualItems();
    const lastItem = virtualItems.at(-1);
    const firstItem = virtualItems.at(0);

    const tableStyle = useMemo(() => {
        if (!lastItem || !firstItem) {
            return undefined;
        }

        const tableHeight = lastItem?.end - firstItem?.start;
        const translateY = firstItem?.start;
        return {
            height: `${tableHeight}px`,
            transform: `translateY(${translateY}px)`
        };
    }, [lastItem?.end, firstItem?.start]);

    useEffect(() => {
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

        if (!lastItem) {
            return;
        }

        if (lastItem.index >= data.length - 1 && hasNext && !loading) {
            fetchNextPage();
        }
    }, [hasNext, fetchNextPage, data.length, loading, rowVirtualizer.getVirtualItems()]);

    const scrollWrapperClass = classNames(styles.scrollTableWrapper, {
        [styles.hasControls]: hasControls
    });

    return (
        <div className={scrollWrapperClass}>
            <ScrollTableHeader columns={columns} />
            <div ref={scrollContainerRef} className={styles.scrollContainer}>
                <div style={bodyStyle}>
                    <Table className={styles.scrollTable} style={tableStyle}>
                        <tbody className={styles.scrollTableBody}>
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const row = data[virtualRow.index];
                                const isSelected = row?.id === selectedRow?.id;
                                const rowStyle = {
                                    height: `${virtualRow.size}px`
                                };
                                const rowClassName = classNames({
                                    [styles.selectedRow]: isSelected,
                                    [styles.selectable]: !!onRowClick
                                });

                                if (!row) return null;

                                return (
                                    <tr
                                        key={row.id}
                                        style={rowStyle}
                                        onClick={() => onRowClick?.(row)}
                                        className={rowClassName}
                                    >
                                        {columns.map((column) => {
                                            const cellStyle = {
                                                width: `${column.width}px`
                                            };

                                            if (column.render) {
                                                return (
                                                    <Fragment key={column.key}>
                                                        {column.render(row, cellStyle)}
                                                    </Fragment>
                                                );
                                            }

                                            return (
                                                <TableCell key={column.key} style={cellStyle}>
                                                    {row[column.key] as string}
                                                </TableCell>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>
            {loading && <Spinner />}
        </div>
    );
};

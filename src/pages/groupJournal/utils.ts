import type { Quarters } from '~/constants/date';

export const getGroupHeaderColumnId = (month: string, index: number) => {
    return `${month}-${index}`;
};

export const parseGroupHeaderColumnId = (columnId: string) => {
    const [month, index] = columnId.split('-');
    return {
        month,
        index: parseInt(index)
    };
};

export const getMarkColumnId = (
    tableIndex: string,
    month: string,
    relationId: number,
    index: number
) => {
    return `${tableIndex}-${getGroupHeaderColumnId(
        month,
        index
    )}-${relationId}`;
};

export const parseMarkColumnId = (columnId: string) => {
    const [tableIndex, month, index, relationId] = columnId.split('-');
    return {
        tableIndex,
        month,
        index: parseInt(index),
        relationId: parseInt(relationId)
    };
};

export const getQuarterMarkColumnId = (
    tableIndex: string,
    quarter: Quarters,
    relationId: number
) => {
    return `${tableIndex}-${quarter}-${relationId}`;
};

export const parseQuarterMarkColumnId = (columnId: string) => {
    const [tableIndex, quarter, relationId] = columnId.split('-');
    return {
        tableIndex,
        quarter: quarter as Quarters,
        relationId: parseInt(relationId)
    };
};

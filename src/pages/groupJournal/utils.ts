import type { Quarters } from '~/constants/date';

interface GroupHeaderColumnId {
    month: string;
    index: number;
}

export const getGroupHeaderColumnId = ({
    month,
    index
}: GroupHeaderColumnId) => {
    return `${month}-${index}`;
};

export const parseGroupHeaderColumnId = (columnId: string) => {
    const [month, index] = columnId.split('-');
    return {
        month,
        index: parseInt(index)
    };
};

interface MarkColumnId {
    tableIndex: string;
    month: string;
    index: number;
    relationId: number;
}

export const getMarkColumnId = ({
    tableIndex,
    month,
    index,
    relationId
}: MarkColumnId) => {
    return `${tableIndex}-${getGroupHeaderColumnId({
        month,
        index
    })}-${relationId}`;
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

interface QuarterMarkColumnId {
    tableIndex: string;
    quarter: Quarters;
    relationId: number;
}

export const getQuarterMarkColumnId = ({
    tableIndex,
    quarter,
    relationId
}: QuarterMarkColumnId) => {
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

export function sortMonths(
    [a, _]: [string, string[]],
    [b, __]: [string, string[]]
) {
    return Number(a) - Number(b);
}

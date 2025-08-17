import { memo } from 'react';
import { NameCellBase } from './NameView';
import { PROGRAMS } from '../../constants/programs';
import styled from 'styled-components';

type Props = {
    classNum: number | undefined;
    program: string | undefined;
    subgroup?: number;
    archived?: boolean;
};

const Base = styled(NameCellBase)`
    text-align: center;
    width: fit-content;
`;

export const ClassView = memo(
    ({ classNum, program, subgroup, archived }: Props) => {
        const classNumStr = classNum || '';
        const programStr = program ? PROGRAMS[program] : '';
        const subgroupStr = subgroup || '';
        const archivedStr = archived ? '(А)' : '';

        return (
            <Base archived={archived}>
                {`${classNumStr} ${programStr} ${subgroupStr} ${archivedStr}`}
            </Base>
        );
    }
);

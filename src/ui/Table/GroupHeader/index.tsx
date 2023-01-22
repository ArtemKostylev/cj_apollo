import {Periods} from '../../../constants/date';
import {PROGRAMS} from '../../../constants/programs';
import React from 'react';
import {GroupHeaderWrapper} from './style/GroupHeaderWrapper.styled';

type Props = {
  period: Periods;
  classNumber: number;
  program: string;
  subgroup: number | undefined;
}

const colSpanMap = {
  [Periods.FIRST]: 23,
  [Periods.SECOND]: 27
}

export const GroupHeader = ({period, classNumber, program, subgroup}: Props) => (
  <GroupHeaderWrapper>
    <th colSpan={colSpanMap[period]}>
      <div>
        <p>{`Класс: ${classNumber}${PROGRAMS[program]}`}</p>
        <p>{`Группа: ${subgroup || 'не указана'}`}</p>
      </div>
    </th>
  </GroupHeaderWrapper>
);

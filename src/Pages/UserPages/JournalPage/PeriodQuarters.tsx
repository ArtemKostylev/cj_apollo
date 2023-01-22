import React, {memo} from 'react';
import {Periods} from '../../../constants/date';
import {QuarterHeader} from './style/QuarterHeader.styled';

type Props = {
  period: Periods;
  onlyHours: boolean;
}

export const PeriodQuarters = memo(({period, onlyHours}: Props) => {
  if (onlyHours) return null;

  if (period == Periods.FIRST) return (
    <>
      <QuarterHeader rowSpan={2}>I четверть</QuarterHeader>
      <QuarterHeader rowSpan={2}>II четверть</QuarterHeader>
    </>
  );

  return (
    <>
      <QuarterHeader rowSpan={2}>III четверть</QuarterHeader>
      <QuarterHeader rowSpan={2}>IV четверть</QuarterHeader>
      <QuarterHeader rowSpan={2}>Годовая оценка</QuarterHeader>
    </>
  )
})
import {Months} from './date';

export const QUARTERS = [
  [8, 9],
  [10, 11],
  [0, 1, 2],
  [3, 4],
];

export const QUARTER_END: Record<number, string> = {
  [Months.MAY]: 'fourth',
  [Months.MARCH]: 'third',
  [Months.OCTOBER]: 'first',
  [Months.DECEMBER]: 'second',
};

export const QUARTERS_RU_OLD = [
  'I четверть',
  'II четверть',
  'III четверть',
  'IV четверть',
];

export enum Months {
  JANUARY,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER
}

export enum Periods {
  FIRST = 1,
  SECOND
}

export enum Quarters {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
  FOURTH = 'fourth',
  YEAR = 'year'
}

export const QuartersRu = {
  [Quarters.FIRST]: 'I четверть',
  [Quarters.SECOND]: 'II четверть',
  [Quarters.THIRD]: 'III четверть',
  [Quarters.FOURTH]: 'IV четверть',
  [Quarters.YEAR]: 'Год',
};

export const PeriodsRu: Record<Periods, string> = {
  [Periods.FIRST]: 'Первое полугодие',
  [Periods.SECOND]: 'Второе полугодие'
}
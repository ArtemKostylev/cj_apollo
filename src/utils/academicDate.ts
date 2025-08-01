import moment from 'moment';
import {Months, MONTHS_IN_QUARTERS, Periods, Quarters} from '../constants/date';
import { QUARTERS } from '../constants/quarters';

const INACTIVE_MONTHS = [Months.JUNE, Months.JULY, Months.AUGUST];

export const SECOND_PERIOD_MONTHS = [Months.JANUARY, Months.FEBRUARY, Months.MARCH, Months.APRIL, Months.MAY];
export const FIRST_PERIOD_MONTHS = [Months.SEPTEMBER, Months.OCTOBER, Months.NOVEMBER, Months.DECEMBER];

export const MONTHS_IN_PERIODS = {
  [Periods.FIRST]: FIRST_PERIOD_MONTHS,
  [Periods.SECOND]: SECOND_PERIOD_MONTHS
};

export const QUARTERS_IN_PERIODS = {
  [Periods.FIRST]: [Quarters.FIRST, Quarters.SECOND],
  [Periods.SECOND]: [Quarters.THIRD, Quarters.FOURTH, Quarters.YEAR]
};

export const getCurrentAcademicMonth = (): Months => {
  const month = moment().month();

  if (INACTIVE_MONTHS.includes(month)) return Months.MAY;

  return month;
};

export const getCurrentAcademicPeriod = (): Periods => {
  const month = moment().month();

  if (FIRST_PERIOD_MONTHS.includes(month)) return Periods.FIRST;

  return Periods.SECOND;
};

export const getLessonsInMonth = (month: Months) => {
  if (Months.JANUARY === month) return 4;
  return 5;
};

export const getCurrentAcademicYear = () => {
  return moment().month() > 7 ? moment().year() : moment().year() - 1;
};

export const getDatesFromMonth = (month: Months, selectedYear: number) => {

  let year = selectedYear || moment().year();

  if (SECOND_PERIOD_MONTHS.includes(month)) year += 1;

  const result = [];
  const startDate = moment().month(month).year(year).startOf('month');
  const endDate = startDate.clone().endOf('month');

  for (let date = startDate; date <= endDate; date.add(1, 'day')) {
    if (date.isoWeekday() !== 7) result.push(date.clone());
  }
  return result;
};

export const getQuartersInPeriod = (period: Periods) => {
  if (period === Periods.FIRST) return [Quarters.FIRST, Quarters.SECOND];
  return [Quarters.THIRD, Quarters.FOURTH, Quarters.YEAR];
};

export const getBorderDatesForPeriod = (period: Periods, year: number) => {

  const currentPeriod = getCurrentAcademicPeriod();

  if (currentPeriod === Periods.FIRST) {
    if (period === Periods.FIRST) {
      return {
        dateGte: moment().year(year).month(Months.SEPTEMBER).startOf('month'),
        dateLte: moment().year(year).month(Months.DECEMBER).endOf('month')
      };
    }

    return {
      dateGte: moment().year(year).month(Months.JANUARY).add(1, 'year').startOf('month'),
      dateLte: moment().year(year).month(Months.MAY).add(1, 'year').endOf('month')
    };
  }

  if (period === Periods.FIRST) {
    return {
      dateGte: moment().year(year).month(Months.SEPTEMBER).subtract(1, 'year').startOf('month'),
      dateLte: moment().year(year).month(Months.DECEMBER).subtract(1, 'year').endOf('month')
    };
  }

  return {
    dateGte: moment().year(year).month(Months.JANUARY).startOf('month'),
    dateLte: moment().year(year).month(Months.MAY).endOf('month')
  };
};

export const getBorderDatesForMidtermExam = (period: Periods, year: number) => {

  const currentPeriod = getCurrentAcademicPeriod();

  return getBorderDatesForPeriod(period, currentPeriod === Periods.SECOND ? year + 1 : year);
};

export const getBorderDatesForMonth = (month: Months, year: number) => {
  const currentPeriod = getCurrentAcademicPeriod();

  if (currentPeriod === Periods.FIRST) {
    if (month > Months.AUGUST) {
      return {
        dateGte: moment().year(year).month(month).startOf('month'),
        dateLte: moment().month(month).endOf('month')
      };
    }

    return {
      dateGte: moment().year(year).month(month).add(1, 'year').startOf('month'),
      dateLte: moment().year(year).month(month).add(1, 'year').endOf('month')
    };
  }

  if (month > Months.AUGUST) {
    return {
      dateGte: moment().year(year).month(month).subtract(1, 'year').startOf('month'),
      dateLte: moment().year(year).month(month).subtract(1, 'year').endOf('month')
    };
  }

  return {
    dateGte: moment().year(year).month(month).startOf('month'),
    dateLte: moment().year(year).month(month).endOf('month')
  };
};

export const getQuartersInMonth = (month: Months) => {
  switch (month) {
    case Months.OCTOBER:
      return [Quarters.FIRST];
    case Months.DECEMBER:
      return [Quarters.SECOND];
    case Months.MARCH:
      return [Quarters.THIRD];
    case Months.MAY:
      return [Quarters.FOURTH, Quarters.YEAR];
    default:
      return [];
  }
};

export function getYearByMonth(targetMonth: Months, year: number | null = null) {
  const currentMonth = moment().month();
  const currentYear = year || moment().year();

  if (currentMonth <= 7) {
    if (targetMonth > 7) {
      return currentYear - 1;
    }
    return currentYear;
  }
  if (targetMonth > 7) {
    return currentYear;

  }
  return currentYear + 1;
}

export function getQuarter(month: number) {
  if (MONTHS_IN_QUARTERS[Quarters.FIRST].includes(month)) return Quarters.FIRST;
  if (MONTHS_IN_QUARTERS[Quarters.SECOND].includes(month)) return Quarters.SECOND;
  if (MONTHS_IN_QUARTERS[Quarters.THIRD].includes(month)) return Quarters.THIRD;
  if (MONTHS_IN_QUARTERS[Quarters.FOURTH].includes(month)) return Quarters.FOURTH;

  return Quarters.THIRD;
}
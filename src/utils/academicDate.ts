import moment from 'moment';
import {
    FIRST_PERIOD_MONTHS,
    Months,
    MONTHS_IN_QUARTERS,
    Periods,
    Quarters,
    type AcademicYears
} from '../constants/date';

const INACTIVE_MONTHS = [Months.JUNE, Months.JULY, Months.AUGUST];

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

export const getCurrentAcademicYear = (): AcademicYears => {
    return moment().month() > 7
        ? (moment().year() as AcademicYears)
        : ((moment().year() - 1) as AcademicYears);
};

export const academicYearToCalendarByPeriod = (
    year: AcademicYears,
    period: Periods
) => {
    if (period === Periods.FIRST) {
        return year;
    }
    return year + 1;
};

export const academicYearToCalendarByMonth = (
    year: AcademicYears,
    month: Months
) => {
    const isFirstPeriod = FIRST_PERIOD_MONTHS.includes(month);

    if (isFirstPeriod) {
        return year;
    }

    return year + 1;
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
                dateGte: moment()
                    .year(year)
                    .month(Months.SEPTEMBER)
                    .startOf('month'),
                dateLte: moment()
                    .year(year)
                    .month(Months.DECEMBER)
                    .endOf('month')
            };
        }

        return {
            dateGte: moment()
                .year(year)
                .month(Months.JANUARY)
                .add(1, 'year')
                .startOf('month'),
            dateLte: moment()
                .year(year)
                .month(Months.MAY)
                .add(1, 'year')
                .endOf('month')
        };
    }

    if (period === Periods.FIRST) {
        return {
            dateGte: moment()
                .year(year)
                .month(Months.SEPTEMBER)
                .subtract(1, 'year')
                .startOf('month'),
            dateLte: moment()
                .year(year)
                .month(Months.DECEMBER)
                .subtract(1, 'year')
                .endOf('month')
        };
    }

    return {
        dateGte: moment().year(year).month(Months.JANUARY).startOf('month'),
        dateLte: moment().year(year).month(Months.MAY).endOf('month')
    };
};

export const getBorderDatesForMidtermExam = (period: Periods, year: number) => {
    const currentPeriod = getCurrentAcademicPeriod();

    return getBorderDatesForPeriod(
        period,
        currentPeriod === Periods.SECOND ? year + 1 : year
    );
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
            dateGte: moment()
                .year(year)
                .month(month)
                .add(1, 'year')
                .startOf('month'),
            dateLte: moment()
                .year(year)
                .month(month)
                .add(1, 'year')
                .endOf('month')
        };
    }

    if (month > Months.AUGUST) {
        return {
            dateGte: moment()
                .year(year)
                .month(month)
                .subtract(1, 'year')
                .startOf('month'),
            dateLte: moment()
                .year(year)
                .month(month)
                .subtract(1, 'year')
                .endOf('month')
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

export function getYearByMonth(
    targetMonth: Months,
    year: number | null = null
) {
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

export function getQuarter(month: Months) {
    if (MONTHS_IN_QUARTERS[Quarters.FIRST].includes(month))
        return Quarters.FIRST;
    if (MONTHS_IN_QUARTERS[Quarters.SECOND].includes(month))
        return Quarters.SECOND;
    if (MONTHS_IN_QUARTERS[Quarters.THIRD].includes(month))
        return Quarters.THIRD;
    if (MONTHS_IN_QUARTERS[Quarters.FOURTH].includes(month))
        return Quarters.FOURTH;

    return Quarters.FOURTH;
}

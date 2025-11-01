import { FIRST_PERIOD_MONTHS, Months, Periods, Quarters, type AcademicYears } from '../constants/date';

const INACTIVE_MONTHS = [Months.JUNE, Months.JULY, Months.AUGUST];

export const getCurrentMonth = (): Months => {
    const month = new Date().getMonth();
    return String(month) as Months;
};

export const getCurrentAcademicMonth = (): Months => {
    const month = getCurrentMonth();

    if (INACTIVE_MONTHS.includes(month)) return Months.MAY;

    return month;
};

export const getCurrentAcademicPeriod = (): Periods => {
    const month = getCurrentMonth();

    if (FIRST_PERIOD_MONTHS.includes(month)) return Periods.FIRST;

    return Periods.SECOND;
};

export const getCurrentAcademicYear = (): AcademicYears => {
    debugger;
    const year = new Date().getFullYear();
    return Number(getCurrentMonth()) > Number(Months.AUGUST) ? (year as AcademicYears) : ((year - 1) as AcademicYears);
};

export const academicYearToCalendarByMonth = (year: AcademicYears, month: Months): number => {
    const isFirstPeriod = FIRST_PERIOD_MONTHS.includes(month);

    if (isFirstPeriod) {
        return Number(year);
    }

    return Number(year) + 1;
};

export const getQuartersInPeriod = (period: Periods) => {
    if (period === Periods.FIRST) return [Quarters.FIRST, Quarters.SECOND];
    return [Quarters.THIRD, Quarters.FOURTH, Quarters.YEAR];
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

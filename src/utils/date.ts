import {QUARTERS} from '../constants/quarters';
import moment from "moment";
import {GROUP_PERIODS, YEAR_PERIODS} from '../constants/periods';

export function getQuarter(month: number) {
    let quarter = null;
    QUARTERS.forEach((item, index) => {
        if (item.includes(month)) quarter = index;
    });

    return quarter === null ? 3 : quarter;
}

export const getCurrentAcademicYear = () => {
    return moment().month() > 7 ? moment().year() : moment().year() - 1;
  };
  

export function getYear(targetMonth: number, year: string | null = null) {
    const currentMonth = moment().month();
    const currentYear = year ? parseInt(year) : moment().year();

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

export function getCurrentPeriod() {
    return moment().month() > 7 ? YEAR_PERIODS.FIRST_HALF : YEAR_PERIODS.SECOND_HALF;
}

export function getDatesForPeriod(period: string, year: number) {

}
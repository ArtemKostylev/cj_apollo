import {QUARTERS} from '../constants/quarters';
import moment from "moment";

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

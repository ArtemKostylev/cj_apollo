import { Months, type AcademicYears } from '~/constants/date';
import { academicYearToCalendarByMonth } from '~/utils/academicDate';
import { addDays, endOfMonth, getDay, isBefore, isEqual } from 'date-fns';

export function generateDatesForMonth(
    month: Months,
    year: AcademicYears
): Date[] {
    const dates = [];
    const calendarYear = academicYearToCalendarByMonth(year, month);

    let currentDate = new Date(calendarYear, Number(month), 1);
    const endDate = endOfMonth(currentDate);

    while (isEqual(currentDate, endDate) || isBefore(currentDate, endDate)) {
        if (getDay(currentDate) !== 0) {
            dates.push(currentDate);
        }
        currentDate = addDays(currentDate, 1);
    }

    return dates;
}

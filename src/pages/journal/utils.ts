import type { Moment } from 'moment';
import moment from 'moment';
import { Months, type AcademicYears } from '~/constants/date';
import { academicYearToCalendarByMonth } from '~/utils/academicDate';

export function generateDatesForMonth(
    month: Months,
    year: AcademicYears
): Moment[] {
    const dates = [];
    const calendarYear = academicYearToCalendarByMonth(year, month);

    const currentDate = moment()
        .year(calendarYear)
        .month(month)
        .startOf('month');
    const endDate = moment().year(calendarYear).month(month).endOf('month');

    while (currentDate.isSameOrBefore(endDate)) {
        if (currentDate.isoWeekday() !== 7) {
            dates.push(currentDate.clone());
        }
        currentDate.add(1, 'day');
    }

    return dates;
}

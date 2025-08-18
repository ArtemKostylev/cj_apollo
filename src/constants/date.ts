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
    FIRST = 'firstHalf',
    SECOND = 'secondHalf'
}

export enum Quarters {
    FIRST = 'first',
    SECOND = 'second',
    THIRD = 'third',
    FOURTH = 'fourth',
    YEAR = 'year'
}

export const QUARTERS_RU = {
    [Quarters.FIRST]: 'I четверть',
    [Quarters.SECOND]: 'II четверть',
    [Quarters.THIRD]: 'III четверть',
    [Quarters.FOURTH]: 'IV четверть',
    [Quarters.YEAR]: 'Год'
};

export const PERIODS_RU: DropdownOptionType[] = [
    { value: Periods.FIRST, text: 'Первое полугодие' },
    { value: Periods.SECOND, text: 'Второе полугодие' }
];

export const MONTHS_NAMES: Record<Months, string> = {
    [Months.SEPTEMBER]: 'Сентябрь',
    [Months.OCTOBER]: 'Октябрь',
    [Months.NOVEMBER]: 'Ноябрь',
    [Months.DECEMBER]: 'Декабрь',
    [Months.JANUARY]: 'Январь',
    [Months.FEBRUARY]: 'Февраль',
    [Months.MARCH]: 'Март',
    [Months.APRIL]: 'Апрель',
    [Months.MAY]: 'Май',
    [Months.JUNE]: 'Июнь',
    [Months.JULY]: 'Июль',
    [Months.AUGUST]: 'Август'
};

export const MONTHS_RU: DropdownOptionType[] = [
    { value: Months.SEPTEMBER, text: MONTHS_NAMES[Months.SEPTEMBER] },
    { value: Months.OCTOBER, text: MONTHS_NAMES[Months.OCTOBER] },
    { value: Months.NOVEMBER, text: MONTHS_NAMES[Months.NOVEMBER] },
    { value: Months.DECEMBER, text: MONTHS_NAMES[Months.DECEMBER] },
    { value: Months.JANUARY, text: MONTHS_NAMES[Months.JANUARY] },
    { value: Months.FEBRUARY, text: MONTHS_NAMES[Months.FEBRUARY] },
    { value: Months.MARCH, text: MONTHS_NAMES[Months.MARCH] },
    { value: Months.APRIL, text: MONTHS_NAMES[Months.APRIL] },
    { value: Months.MAY, text: MONTHS_NAMES[Months.MAY] }
];

export type AcademicYears = 2021 | 2022 | 2023 | 2024 | 2025;

export const YEARS_NAMES: Record<AcademicYears, string> = {
    2021: '2021/2022',
    2022: '2022/2023',
    2023: '2023/2024',
    2024: '2024/2025',
    2025: '2025/2026'
};

export const YEARS: DropdownOptionType[] = [
    { value: 2021, text: YEARS_NAMES[2021] },
    { value: 2022, text: YEARS_NAMES[2022] },
    { value: 2023, text: YEARS_NAMES[2023] },
    { value: 2024, text: YEARS_NAMES[2024] },
    { value: 2025, text: YEARS_NAMES[2025] }
];

export const MONTHS_IN_QUARTERS = {
    [Quarters.FIRST]: [8, 9],
    [Quarters.SECOND]: [10, 11],
    [Quarters.THIRD]: [0, 1, 2],
    [Quarters.FOURTH]: [3, 4]
};

export const DATE_FORMAT = 'YYYY-MM-DDT00:00:00.000[Z]';
export const UI_DATE_FORMAT = 'DD.MM.YYYY';

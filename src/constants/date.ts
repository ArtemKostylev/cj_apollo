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

export const PERIODS_RU = new Map<string, DropdownOptionType>([
    [Periods.FIRST, { value: Periods.FIRST, text: 'Первое полугодие' }],
    [Periods.SECOND, { value: Periods.SECOND, text: 'Второе полугодие' }]
]);

export const MONTHS_RU = new Map<number, DropdownOptionType>([
    [Months.SEPTEMBER, { value: Months.SEPTEMBER, text: 'Сентябрь' }],
    [Months.OCTOBER, { value: Months.OCTOBER, text: 'Октябрь' }],
    [Months.NOVEMBER, { value: Months.NOVEMBER, text: 'Ноябрь' }],
    [Months.DECEMBER, { value: Months.DECEMBER, text: 'Декабрь' }],
    [Months.JANUARY, { value: Months.JANUARY, text: 'Январь' }],
    [Months.FEBRUARY, { value: Months.FEBRUARY, text: 'Февраль' }],
    [Months.MARCH, { value: Months.MARCH, text: 'Март' }],
    [Months.APRIL, { value: Months.APRIL, text: 'Апрель' }],
    [Months.MAY, { value: Months.MAY, text: 'Май' }]
]);

export type AvailableYears = 2021 | 2022 | 2023 | 2024 | 2025;

export const YEARS_NAMES: Record<AvailableYears, string> = {
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

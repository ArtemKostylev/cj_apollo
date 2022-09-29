export const PERIODS = ['first', 'second', 'third', 'fourth'];

export const YEAR_PERIODS = {
  FIRST_HALF: 'firstHalf',
  SECOND_HALF: 'secondHalf'
}

export const PERIOD_NAMES = {
  [YEAR_PERIODS.FIRST_HALF]: 'Первое полугодие',
  [YEAR_PERIODS.SECOND_HALF]: 'Второе полугодие'
}

export const GROUP_PERIODS = {
  first_half: {
    name: 'Первое полугодие',
    id: 0,
    data: [
      {
        id: 9,
        name: 'Сентябрь',
        days: Array(5).fill(1),
      },
      {
        id: 10,
        name: 'Октябрь',
        days: Array(5).fill(1),
      },
      {
        id: 11,
        name: 'Ноябрь',
        days: Array(5).fill(1),
      },
      {
        id: 12,
        name: 'Декабрь',
        days: Array(5).fill(1),
      },
    ],
  },
  second_half: {
    name: 'Второе полугодие',
    id: 1,
    data: [
      {
        id: 1,
        name: 'Январь',
        days: Array(4).fill(1),
      },
      {
        id: 2,
        name: 'Февраль',
        days: Array(5).fill(1),
      },
      {
        id: 3,
        name: 'Март',
        days: Array(5).fill(1),
      },

      {
        id: 4,
        name: 'Апрель',
        days: Array(5),
      },
      {
        id: 5,
        name: 'Май',
        days: Array(5),
      },
    ],
  },
};
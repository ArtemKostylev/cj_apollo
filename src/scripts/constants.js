export const AUTH_TOKEN = "auth-token";
export const TEACHER = "teacher-id";
export const USER = "user";
export const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export const ACADEMIC_YEARS = [
  { displayName: "2021/2022", value: 2021 },
  { displayName: "2020/2021", value: 2020 },
];

export const QUATERS = [
  [8, 9],
  [10, 11],
  [0, 1, 2],
  [3, 4],
];

export const PROGRAMS = {
  PP_5: "(5)ПП",
  PP_8: "(8)ПП",
  OP: "ОП",
};

export const QUATER_END = {
  4: "fouth",
  2: "third",
  9: "first",
  11: "second",
};

export const QUATERS_RU = [
  "I четверть",
  "II четверть",
  "III четверть",
  "IV четверть",
];

export const PERIODS = ["first", "second", "third", "fourth"];

export const GROUP_PERIODS = {
  first_half: {
    name: "Первое полугодие",
    id: 0,
    data: [
      {
        id: 9,
        name: "Сентябрь",
        days: Array(5).fill(1),
      },
      {
        id: 10,
        name: "Октябрь",
        days: Array(5).fill(1),
      },
      {
        id: 11,
        name: "Ноябрь",
        days: Array(5).fill(1),
      },
      {
        id: 12,
        name: "Декабрь",
        days: Array(5).fill(1),
      },
    ],
  },
  second_half: {
    name: "Второе полугодие",
    id: 1,
    data: [
      {
        id: 1,
        name: "Январь",
        days: Array(4).fill(1),
      },
      {
        id: 2,
        name: "Февраль",
        days: Array(5).fill(1),
      },
      {
        id: 3,
        name: "Март",
        days: Array(5).fill(1),
      },

      {
        id: 4,
        name: "Апрель",
        days: Array(5),
      },
      {
        id: 5,
        name: "Май",
        days: Array(5),
      },
    ],
  },
};

export const AVAILABLE_MARKS = [
  "2",
  "3",
  "4",
  "4-",
  "4+",
  "5-",
  "5+",
  "5",
  "Б",
  ".",
  "Пусто",
  "",
];

export const userItems = [
  {
    name: "Journal",
    path: "/journal",
    title: "Классный журнал",
  },
  {
    name: "Consult",
    path: "/consult",
    title: "Консультации",
  },
  {
    name: "Compensation",
    path: "/compensation",
    title: "Возмещение",
  },
  {
    name: "Notes",
    path: "/notes",
    title: "Заметки",
  },
];

export const adminItems = [
  {
    name: "Journals",
    path: "/journals",
    title: "Журналы",
  },
  {
    name: "DataPage",
    path: "/data",
    title: "Изменение данных",
  },
  {
    name: "Reports",
    path: "/reports",
    title: "Отчеты",
  },
  {
    name: "Specs",
    path: "/specs",
    title: "Специальности",
  },
];

export const subRoute = {
  name: "Subgroups",
  path: "/subgroups",
  title: "Группы",
};

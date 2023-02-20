import {ROUTES} from './routes';

type Resources = Record<string, { path: string, title: string }>;

export const USER_RESOURCES: Resources = {
  journal: {
    path: '/journal',
    title: 'Классный журнал',
  },
  consult: {
    path: '/consult',
    title: 'Консультации',
  },
  compensation: {
    path: '/compensation',
    title: 'Возмещение',
  },
  midtermExam: {
    path: ROUTES.MIDTERM_EXAM,
    title: 'Промежуточная аттестация',
  },
  notes: {
    path: '/notes',
    title: 'Заметки',
  },
};

export const ADMIN_RESOURCES: Resources = {
  journals: {
    path: '/journals',
    title: 'Журналы',
  },
  data: {
    path: '/data',
    title: 'Изменение данных',
  },
  reports: {
    path: '/reports',
    title: 'Отчеты',
  },
  specs: {
    path: '/specs',
    title: 'Специальности',
  },
  midtermExamTypes: {
    path: ROUTES.MIDTERM_EXAM_TYPES,
    title: 'Типы промежуточной аттестации'
  }
};

export const SUBGROUPS_RESOURCE = {
  path: '/subgroups',
  title: 'Группы',
};

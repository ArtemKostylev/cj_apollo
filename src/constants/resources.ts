import { Route as MidtermExamRoute } from '~/routes/_main.midtermExam';
import { Route as MidtermExamTypesRoute } from '~/routes/_main.midtermExamTypes';
import { Route as NotesRoute } from '~/routes/_main.notes';
import { Route as SubgroupsRoute } from '~/routes/_main.subgroups';
import { Route as ReportsRoute } from '~/routes/_main.reports';
import { Route as SpecializationsRoute } from '~/routes/_main.specializations';
import { Route as JournalRoute } from '~/routes/_main.journal';
import { Route as ConsultRoute } from '~/routes/_main.consult';
import { Route as GroupConsultRoute } from '~/routes/_main.groupConsult';
import { Route as CompensationRoute } from '~/routes/_main.compensation';
import { Route as GroupJournalRoute } from '~/routes/_main.groupJournal';
import { Route as UsersRoute } from '~/routes/_main.users';
import { Route as TeachersRoute } from '~/routes/_main.teachers';
import { Route as CoursesRoute } from '~/routes/_main.courses';
import { Route as StudentsRoute } from '~/routes/_main.students';

type Resources = Record<string, { path: string; title: string; order: number }>;

export const USER_RESOURCES: Resources = {
    [JournalRoute.path]: {
        path: JournalRoute.fullPath,
        title: 'Классный журнал',
        order: 0
    },
    [ConsultRoute.path]: {
        path: ConsultRoute.fullPath,
        title: 'Консультации',
        order: 2
    },
    [GroupConsultRoute.path]: {
        path: GroupConsultRoute.fullPath,
        title: 'Групповые консультации',
        order: 3
    },
    [CompensationRoute.path]: {
        path: CompensationRoute.fullPath,
        title: 'Возмещение',
        order: 4
    },
    [MidtermExamRoute.path]: {
        path: MidtermExamRoute.fullPath,
        title: 'Промежуточная аттестация',
        order: 5
    },
    [NotesRoute.path]: {
        path: NotesRoute.fullPath,
        title: 'Заметки',
        order: 6
    }
};

export const ADMIN_RESOURCES: Resources = {
    [TeachersRoute.path]: {
        path: TeachersRoute.fullPath,
        title: 'Преподаватели',
        order: 0
    },
    [CoursesRoute.path]: {
        path: CoursesRoute.fullPath,
        title: 'Учебные предметы',
        order: 1
    },
    [StudentsRoute.path]: {
        path: StudentsRoute.fullPath,
        title: 'Ученики',
        order: 2
    },
    [ReportsRoute.path]: {
        path: ReportsRoute.fullPath,
        title: 'Отчеты',
        order: 3
    },
    [SpecializationsRoute.path]: {
        path: SpecializationsRoute.fullPath,
        title: 'Специальности',
        order: 4
    },
    [MidtermExamTypesRoute.path]: {
        path: MidtermExamTypesRoute.fullPath,
        title: 'Типы промежуточной аттестации',
        order: 5
    },
    [UsersRoute.path]: {
        path: UsersRoute.fullPath,
        title: 'Пользователи',
        order: 6
    }
};

export const SUBGROUPS_RESOURCE = {
    path: SubgroupsRoute.fullPath,
    title: 'Группы',
    order: 7
};

export const GROUP_JOURNAL_RESOURCE = {
    path: GroupJournalRoute.fullPath,
    title: 'Групповой журнал',
    order: 1
};

export const ALL_RESOURCES: Resources = {
    ...USER_RESOURCES,
    ...ADMIN_RESOURCES,
    [SubgroupsRoute.path]: SUBGROUPS_RESOURCE,
    [GroupJournalRoute.path]: GROUP_JOURNAL_RESOURCE
};

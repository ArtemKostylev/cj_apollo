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

type Resources = Record<string, { path: string; title: string; order: number }>;

export const USER_RESOURCES: Resources = {
    journal: {
        path: JournalRoute.fullPath,
        title: 'Классный журнал',
        order: 0
    },
    consult: {
        path: ConsultRoute.fullPath,
        title: 'Консультации',
        order: 2
    },
    groupConsult: {
        path: GroupConsultRoute.fullPath,
        title: 'Групповые консультации',
        order: 3
    },
    compensation: {
        path: CompensationRoute.fullPath,
        title: 'Возмещение',
        order: 4
    },
    midtermExam: {
        path: MidtermExamRoute.fullPath,
        title: 'Промежуточная аттестация',
        order: 5
    },
    notes: {
        path: NotesRoute.fullPath,
        title: 'Заметки',
        order: 6
    }
};

export const ADMIN_RESOURCES: Resources = {
    reports: {
        path: ReportsRoute.fullPath,
        title: 'Отчеты',
        order: 1
    },
    specs: {
        path: SpecializationsRoute.fullPath,
        title: 'Специальности',
        order: 2
    },
    midtermExamTypes: {
        path: MidtermExamTypesRoute.fullPath,
        title: 'Типы промежуточной аттестации',
        order: 3
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

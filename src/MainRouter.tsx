import { Redirect, Route, Switch } from 'react-router-dom';
import { Journals } from './pages/admin/JournalsPage/Journals';
import DataPageApollo from './pages/admin/DataPage/DataPageApollo';
import Journal from './pages/journal/Journal';
import { Compensation } from './pages/compensation';
import { Notes } from './pages/notes';
import { Reports } from './pages/admin/ReportsPage/Reports';
import { Subgroups } from './pages/subgroups';
import { Specialization } from './pages/admin/SpecPage';
import { MidtermExamTypes } from './pages/admin/MidtermExamTypes';
import { MidtermExamWithContext as MidtermExam } from './pages/midtermExam';
import { memo } from 'react';
import { useUserData } from './hooks/useUserData';
import { ADMIN, TEACHER } from './constants/roles';
import get from 'lodash/get';
import { ROUTES } from './constants/routes';
import { Login } from './pages/login';
import { ErrorScreen } from './pages/error';
import { MainLayout } from './components/mainLayout';
import { Spinner } from './components/Spinner';
import { Consults } from './pages/consults';
import { GroupConsults } from './pages/groupConsults';

const AdminRoutes = () => (
    <Switch>
        <Route path={ROUTES.JOURNALS} component={Journals} />
        <Route path={ROUTES.DATA} component={DataPageApollo} />
        <Route path={ROUTES.JOURNAL} component={Journal} />
        <Route path={ROUTES.COMPENSATION} component={Compensation} />
        <Route path={ROUTES.NOTES} component={Notes} />
        <Route path={ROUTES.CONSULT} render={Consults} />
        <Route path={ROUTES.GROUP_CONSULT} render={GroupConsults} />
        <Route path={ROUTES.REPORTS} component={Reports} />
        <Route path={ROUTES.SPECS} component={Specialization} />
        <Route path={ROUTES.MIDTERM_EXAM_TYPES} component={MidtermExamTypes} />
        <Redirect from={ROUTES.HOME} to={ROUTES.JOURNALS} />
    </Switch>
);

const TeacherRoutes = () => (
    <Switch>
        <Route path={ROUTES.COMPENSATION} component={Compensation} />
        <Route path={ROUTES.NOTES} component={Notes} />
        <Route path={ROUTES.CONSULT} component={Consults} />
        <Route path={ROUTES.GROUP_CONSULT} render={GroupConsults} />
        <Route path={ROUTES.SUBGROUPS} component={Subgroups} />
        <Route path={ROUTES.MIDTERM_EXAM} component={MidtermExam} />
        <Route path={ROUTES.JOURNAL} component={Journal} />
        <Redirect from={ROUTES.HOME} to={ROUTES.JOURNAL} />
    </Switch>
);

export const AppRouter = memo(() => {
    const auth = useUserData();
    const role = get(auth, 'user.role');

    if (role == ADMIN) return <AdminRoutes />;
    if (role == TEACHER) return <TeacherRoutes />;

    return null;
});

export const MainRouter = memo(() => {
    const { loading } = useUserData();

    if (loading) return <Spinner />;

    return (
        <Switch>
            <Route path={ROUTES.LOGIN} component={Login} />
            <Route path={ROUTES.ERROR} component={ErrorScreen} />
            <Route path={ROUTES.HOME} component={MainLayout} />
        </Switch>
    );
});

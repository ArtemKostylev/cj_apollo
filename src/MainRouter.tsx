import { Redirect, Route, Switch } from "react-router-dom";
import { Journals } from "./Pages/AdminPages/JournalsPage/Journals";
import DataPageApollo from "./Pages/AdminPages/DataPage/DataPageApollo";
import Journal from "./Pages/UserPages/JournalPage/Journal";
import { Compensation } from "./Pages/UserPages/Compensation";
import { Notes } from "./Pages/UserPages/Notes";
import { ConsultController } from "./Pages/UserPages/ConsultsPage/ConsultController";
import { Reports } from "./Pages/AdminPages/ReportsPage/Reports";
import { Subgroups } from "./Pages/UserPages/Subgroups";
import { Specialization } from "./Pages/AdminPages/SpecPage";
import { MidtermExamTypes } from "./Pages/AdminPages/MidtermExamTypes";
import { MidtermExamWithContext as MidtermExam } from "./Pages/UserPages/MidtermExam";
import React, { memo } from "react";
import { useAuth } from "./hooks/useAuth";
import { ADMIN, TEACHER } from "./constants/roles";
import get from "lodash/get";
import { ROUTES } from "./constants/routes";
import { Login } from "./Pages/Login";
import { ErrorScreen } from "./Pages/ErrorScreen";
import { MainLayout } from "./ui/MainLayout";
import { Spinner } from "./ui/Spinner";

const AdminRoutes = () => (
  <Switch>
    <Route path={ROUTES.JOURNALS} component={Journals} />
    <Route path={ROUTES.DATA} component={DataPageApollo} />
    <Route path={ROUTES.JOURNAL} component={Journal} />
    <Route path={ROUTES.COMPENSATION} component={Compensation} />
    <Route path={ROUTES.NOTES} component={Notes} />
    <Route path={ROUTES.CONSULT} render={ConsultController} />
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
    <Route path={ROUTES.CONSULT} component={ConsultController} />
    <Route path={ROUTES.SUBGROUPS} component={Subgroups} />
    <Route path={ROUTES.MIDTERM_EXAM} component={MidtermExam} />
    <Route path={ROUTES.JOURNAL} component={Journal} />
    <Redirect from={ROUTES.HOME} to={ROUTES.JOURNAL} />
  </Switch>
);

export const AppRouter = memo(() => {
  const auth = useAuth();
  const role = get(auth, "user.role");

  if (role == ADMIN) return <AdminRoutes />;
  if (role == TEACHER) return <TeacherRoutes />;

  return null;
});

export const MainRouter = memo(() => {
  const { loading } = useAuth();

  if (loading) return <Spinner />;

  return (
    <Switch>
      <Route path={ROUTES.LOGIN} component={Login} />
      <Route path={ROUTES.ERROR} component={ErrorScreen} />
      <Route path={ROUTES.HOME} component={MainLayout} />
    </Switch>
  );
});

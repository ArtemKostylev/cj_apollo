import React, { useRef, useState } from "react";
import "../styles/App.css";
import Menu from "./Menu";
import Header from "./Header";
import Journal from "./UserPages/JournalPage/Journal";
import Compensation from "./UserPages/CompensationPage/Compensation";
import Login from "./Login";
import { Switch, Route, Redirect } from "react-router-dom";
import { useAuth } from "../scripts/use-auth.js";
import Journals from "./AdminPages/JournalsPage/Journals";
import DataPageApollo from "./AdminPages/DataPage/DataPageApollo";
import { Notes } from "./UserPages/NotesPage/Notes";
import { ConsultController } from "./UserPages/ConsultsPage/ConsultController";
import { Subgroups } from "./UserPages/SubgroupsPage/Subgroups";
import { ErrorScreen } from "./ErrorScreen";
import { ErrorBoundary } from "react-error-boundary";
import { Reports } from "./AdminPages/ReportsPage/Reports";

export default function App() {
  const auth = useAuth();

  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/error" component={ErrorScreen} />
      <Route
        path="/"
        render={({ location }) =>
          auth.user ? <Content /> : <Redirect to="/login" />
        }
      />
    </Switch>
  );
}

const Content = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const auth = useAuth();
  const menuRef = useRef();

  const menuClick = (event) => {
    setMenuVisible((prev) => !prev);
  };

  const adminBoard = (
    <Switch>
      <Route path="/journals" component={Journals} />
      <Route path="/data" component={DataPageApollo} />
      <Route
        path="/journal"
        render={(props) => <Journal {...props} menuRef={menuRef} />}
      />
      <Route
        path="/compensation"
        render={(props) => <Compensation {...props} menuRef={menuRef} />}
      />
      <Route
        path="/notes"
        render={(props) => <Notes {...props} menuRef={menuRef} />}
      />
      <Route
        path="/consult"
        render={(props) => <ConsultController {...props} menuRef={menuRef} />}
      />
      <Route path="/reports" component={Reports} />
      <Redirect from="/" to="/journals" />
    </Switch>
  );

  const userBoard = (
    <Switch>
      <Route
        path="/journal"
        render={(props) => <Journal {...props} menuRef={menuRef} />}
      />
      <Route
        path="/compensation"
        render={(props) => <Compensation {...props} menuRef={menuRef} />}
      />
      <Route
        path="/notes"
        render={(props) => <Notes {...props} menuRef={menuRef} />}
      />
      <Route
        path="/consult"
        render={(props) => <ConsultController {...props} menuRef={menuRef} />}
      />
      <Route
        path="/subgroups"
        render={(props) => <Subgroups {...props} menuRef={menuRef} />}
      />
      <Redirect from="/" to="/journal" />
    </Switch>
  );

  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorScreen}>
        <Menu
          visible={menuVisible}
          close={() => setMenuVisible((prev) => !prev)}
        ></Menu>
        <div
          className={`Cover ${menuVisible ? "menuVisible" : ""}`}
          onClick={() => setMenuVisible((prev) => !prev)}
        />
        <div className={`Content ${menuVisible ? "menuVisible" : ""}`}>
          <Header menuClick={menuClick} menuRef={menuRef}></Header>
          {auth.user.roleId === 1 ? adminBoard : userBoard}
        </div>
      </ErrorBoundary>
    </div>
  );
};
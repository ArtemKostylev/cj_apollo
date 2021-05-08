import React, { useCallback, useRef, useState } from "react";
import "../styles/App.css";
import Menu from "./Menu";
import Header from "./Header";
import Journal from "./Journal";
import Compensation from "./Compensation";
import Login from "./Login";
import { Switch, Route, Redirect } from "react-router-dom";
import { useAuth } from "../scripts/use-auth.js";
import Journals from "./Journals";
import DataPage from "./DataPage";
import { Notes } from "./Notes";
import { Consult } from "./Consult";
import { Subgroups } from "./Subgroups";
import { ErrorScreen } from "./ErrorScreen";
import { ErrorBoundary } from "react-error-boundary";

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
  const [changed, setChanged] = useState(false);
  const auth = useAuth();
  const menuRef = useRef();

  const menuClick = (event) => {
    setMenuVisible((prev) => !prev)
  }

  const adminBoard = (
    <Switch>
      <Route path="/journals" component={Journals} />
      <Route path="/data" component={DataPage} />
      <Redirect from="/" to="/journals" />
    </Switch>
  );

  const userBoard = (
    <Switch>
      <Route path="/journal" render={(props) => (<Journal {...props} menuRef={menuRef} />)} />
      <Route path="/compensation" render={(props) => (<Compensation {...props} menuRef={menuRef} />)} />
      <Route path="/notes" render={(props) => (<Notes {...props} menuRef={menuRef} />)} />
      <Route path="/consult" render={(props) => (<Consult {...props} menuRef={menuRef} />)} />
      <Route path="/subgroups" render={(props) => (<Subgroups {...props} menuRef={menuRef} />)} />
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

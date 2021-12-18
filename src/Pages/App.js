import React, { useRef, useState } from 'react';
import '../styles/App.css';
import Menu from '../shared/Menu';
import Header from '../shared/Header';
import Journal from './UserPages/JournalPage/Journal';
import Compensation from './UserPages/CompensationPage/Compensation';
import Login from './Login';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useAuth } from '../utils/use-auth.js';
import { Journals } from './AdminPages/JournalsPage/Journals';
import DataPageApollo from './AdminPages/DataPage/DataPageApollo';
import { Notes } from './UserPages/NotesPage/Notes';
import { ConsultController } from './UserPages/ConsultsPage/ConsultController';
import { Subgroups } from './UserPages/SubgroupsPage/Subgroups';
import { ErrorScreen } from './ErrorScreen';
import { ErrorBoundary } from 'react-error-boundary';
import { Reports } from './AdminPages/ReportsPage/Reports';
import { Specialization } from './AdminPages/SpecPage';
import { ADMIN } from '../constants/roles';

const AdminRoutes = ({ menuRef }) => (
  <Switch>
    <Route path='/journals' component={Journals} />
    <Route path='/data' component={DataPageApollo} />
    <Route
      path='/journal'
      render={(props) => <Journal {...props} menuRef={menuRef} />}
    />
    <Route
      path='/compensation'
      render={(props) => <Compensation {...props} menuRef={menuRef} />}
    />
    <Route
      path='/notes'
      render={(props) => <Notes {...props} menuRef={menuRef} />}
    />
    <Route
      path='/consult'
      render={(props) => <ConsultController {...props} menuRef={menuRef} />}
    />
    <Route path='/reports' component={Reports} />
    <Route path='/specs' component={Specialization} />
    <Redirect from='/' to='/journals' />
  </Switch>
);

const TeacherRoutes = ({ menuRef }) => (
  <Switch>
    <Route
      path='/journal'
      render={(props) => <Journal {...props} menuRef={menuRef} />}
    />
    <Route
      path='/compensation'
      render={(props) => <Compensation {...props} menuRef={menuRef} />}
    />
    <Route
      path='/notes'
      render={(props) => <Notes {...props} menuRef={menuRef} />}
    />
    <Route
      path='/consult'
      render={(props) => <ConsultController {...props} menuRef={menuRef} />}
    />
    <Route
      path='/subgroups'
      render={(props) => <Subgroups {...props} menuRef={menuRef} />}
    />
    <Redirect from='/' to='/journal' />
  </Switch>
);

const Content = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const auth = useAuth();
  const menuRef = useRef();

  const menuClick = (event) => {
    setMenuVisible((prev) => !prev);
  };

  return (
    <div className='App'>
      <ErrorBoundary FallbackComponent={ErrorScreen}>
        <Menu
          isOpen={menuVisible}
          onClose={() => setMenuVisible((prev) => !prev)}
        ></Menu>
        <div
          className={`Cover ${menuVisible && 'menuVisible'}`}
          onClick={() => setMenuVisible((prev) => !prev)}
        />
        <div className={`Content ${menuVisible && 'menuVisible'}`}>
          <Header menuClick={menuClick} menuRef={menuRef} />
          {auth.user.role.name === ADMIN ? <AdminRoutes /> : <TeacherRoutes />}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default function App() {
  const auth = useAuth();

  const history = useHistory();
  if (!auth?.user?.role) {
    localStorage.clear();
    history.push('/login');
  }

  return (
    <Switch>
      <Route path='/login'>
        <Login />
      </Route>
      <Route path='/error' component={ErrorScreen} />
      <Route
        path='/'
        render={() => (auth.user ? <Content /> : <Redirect to='/login' />)}
      />
    </Switch>
  );
}

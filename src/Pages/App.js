import React, {useRef, useState} from 'react';
import '../styles/App.css';
import Menu from '../shared/Menu';
import Header from '../shared/Header';
import Journal from './UserPages/JournalPage/Journal';
import {Compensation} from './UserPages/Compensation';
import {Login} from './Login';
import {Switch, Route, Redirect, useHistory} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {Journals} from './AdminPages/JournalsPage/Journals';
import DataPageApollo from './AdminPages/DataPage/DataPageApollo';
import {Notes} from './UserPages/Notes';
import {ConsultController} from './UserPages/ConsultsPage/ConsultController';
import {Subgroups} from './UserPages/Subgroups';
import {ErrorScreen} from './ErrorScreen';
import {ErrorBoundary} from 'react-error-boundary';
import {Reports} from './AdminPages/ReportsPage/Reports';
import {Specialization} from './AdminPages/SpecPage';
import {ADMIN} from '../constants/roles';
import {MidtermExam} from './UserPages/MidtermExam';

const AdminRoutes = <Switch>
    <Route path='/journals' component={Journals}/>
    <Route path='/data' component={DataPageApollo}/>
    <Route path='/journal' component={Journal}/>
    <Route path='/compensation' component={Compensation}/>
    <Route path='/notes' component={Notes}/>
    <Route path='/consult' render={ConsultController}/>
    <Route path='/reports' component={Reports}/>
    <Route path='/specs' component={Specialization}/>
    <Redirect from='/' to='/journals'/>
</Switch>

const TeacherRoutes = <Switch>
    <Route path='/journal' component={Journal}/>
    <Route path='/compensation' component={Compensation}/>
    <Route path='/notes' component={Notes}/>
    <Route path='/consult' component={ConsultController}/>
    <Route path='/subgroups' component={Subgroups}/>
    <Route path='/midtermExam' component={MidtermExam}/>
    <Redirect from='/' to='/journal'/>
</Switch>

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
                />
                <div
                    className={`Cover ${menuVisible && 'menuVisible'}`}
                    onClick={() => setMenuVisible((prev) => !prev)}
                />
                <div className={`Content ${menuVisible && 'menuVisible'}`}>
                    <Header menuClick={menuClick} menuRef={menuRef}/>
                    {auth.user.role === ADMIN ? AdminRoutes : TeacherRoutes}
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
                <Login/>
            </Route>
            <Route path='/error' component={ErrorScreen}/>
            <Route
                path='/'
                render={() => (auth.user ? <Content/> : <Redirect to='/login'/>)}
            />
        </Switch>
    );
}

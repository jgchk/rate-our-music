import { FunctionComponent, h } from 'preact';
import { Redirect, Route, HashRouter as Router, Switch } from 'react-router-dom';
import ROUTES from '../constants/routes';
import AccountPage from './account';
import Home from './home';
import Login from './login';
import NavBar from './nav-bar';
import NotFound from './not-found';

const Layout: FunctionComponent = () => (
  <Router>
    <NavBar />

    <main>
      <Switch>
        <Route path={ROUTES.home} exact>
          <Home />
        </Route>
        <Route path={ROUTES.login} exact>
          <Login />
        </Route>
        <Route path={ROUTES.account}>
          <AccountPage />
        </Route>
        <Route path={ROUTES.unknown} exact>
          <NotFound />
        </Route>
        <Route path='*'>
          <Redirect to={ROUTES.unknown} />
        </Route>
      </Switch>
    </main>
  </Router>
);

export default Layout;

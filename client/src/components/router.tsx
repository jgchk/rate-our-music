import { FunctionComponent, h } from 'preact';
import PreactRouter from 'preact-router';
import ROUTES from '../constants/routes';
import Home from './home';
import Login from './login';
import NotFound from './not-found';

const Router: FunctionComponent = () => (
  <PreactRouter>
    <Home path={ROUTES.home} />
    <Login path={ROUTES.login} />
    <NotFound default />
  </PreactRouter>
);

export default Router;

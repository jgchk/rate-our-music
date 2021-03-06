import { FunctionComponent, h } from 'preact';
import PreactRouter from 'preact-router';
import Home from './home';
import Login from './login';
import NotFound from './not-found';

export const ROUTES = {
  home: '/',
  login: '/login',
} as const;

const Router: FunctionComponent = () => (
  <PreactRouter>
    <Home path={ROUTES.home} />
    <Login path={ROUTES.login} />
    <NotFound default />
  </PreactRouter>
);

export default Router;

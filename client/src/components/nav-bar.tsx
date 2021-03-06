import { FunctionComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import ROUTES from '../constants/routes';

const NavBar: FunctionComponent = () => (
  <nav>
    <Link href={ROUTES.home}>Home</Link>
  </nav>
);

export default NavBar;

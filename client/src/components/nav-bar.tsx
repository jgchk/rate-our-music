import { FunctionComponent, h } from 'preact';
import { NavLink } from 'react-router-dom';
import ROUTES from '../constants/routes';
import { isLoggedIn, isLoggedOut, useSession } from '../contexts/session';

const NavBar: FunctionComponent = () => {
  const session = useSession();

  return (
    <nav>
      <NavLink to={ROUTES.home}>Home</NavLink>
      {isLoggedIn(session) && (
        <>
          <div>{session.account.username}</div>
          <button onClick={() => session.logout()}>Logout</button>
        </>
      )}
      {isLoggedOut(session) && <NavLink to={ROUTES.login}>Login</NavLink>}
    </nav>
  );
};

export default NavBar;

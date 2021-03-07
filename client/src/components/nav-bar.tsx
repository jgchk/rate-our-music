import { FunctionComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import ROUTES from '../constants/routes';
import { useSession } from '../contexts/session';

const NavBar: FunctionComponent = () => {
  const session = useSession();

  return (
    <nav>
      <Link href={ROUTES.home}>Home</Link>
      {session.type === 'logged in' && (
        <>
          <div>{session.account.username}</div>
          <button onClick={() => session.logout()}>Logout</button>
        </>
      )}
      {session.type === 'logged out' && <Link href={ROUTES.login}>Login</Link>}
    </nav>
  );
};

export default NavBar;

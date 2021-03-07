import { FunctionComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Redirect, useParams } from 'react-router-dom';
import ROUTES from '../constants/routes';
import { isLoggedIn, useSession } from '../contexts/session';
import { useWhoami } from '../graphql/whoami';

const AccountPage: FunctionComponent<{ id: number }> = ({ id }) => {
  const { session } = useSession();
  const [whoami] = useWhoami();

  useEffect(() => {
    if (isLoggedIn(session))
      void whoami();
  }, [session, whoami]);

  return <div>{ id }</div>;
};

const Wrapper: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const numId = Number.parseInt(id);
  return Number.isNaN(numId) ? <Redirect to={ROUTES.unknown} /> : <AccountPage id={numId} />;
};

export default Wrapper;

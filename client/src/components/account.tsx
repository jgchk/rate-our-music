import { FunctionComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Redirect, useParams } from 'react-router-dom';
import ROUTES from '../constants/routes';
import { useWhoami } from '../graphql/whoami';

const AccountPage: FunctionComponent<{ id: number }> = ({ id }) => {
  const [whoami] = useWhoami();

  useEffect(() => {
    void whoami();
  }, [whoami]);

  return <div>{ id }</div>;
};

const Wrapper: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const numId = Number.parseInt(id);
  return Number.isNaN(numId) ? <Redirect to={ROUTES.unknown} /> : <AccountPage id={numId} />;
};

export default Wrapper;

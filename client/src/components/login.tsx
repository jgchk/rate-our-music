import { FunctionComponent, h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Redirect } from 'react-router-dom';
import ROUTES from '../constants/routes';
import { LoggedOut, isLoggedIn, useSession } from '../contexts/session';
import { isFailed, isLoading } from '../utils/datum';
import { InvalidCredentialsError } from '../utils/errors';

const handleInput = (handler: (value: string) => void) => (event: Event) => {
  event.preventDefault();
  if (event.target instanceof HTMLInputElement) {
    handler(event.target.value);
  }
};

const Login: FunctionComponent<{ session: LoggedOut }> = ({ session }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback((event: Event) => {
    event.preventDefault();
    void session.login(username, password);
  }, [password, session, username]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>
          Username
          <input
            id='username'
            type='text'
            required
            value={username}
            onInput={handleInput(setUsername)}
          />
        </label>
        <label htmlFor='password'>
          Password
          <input
            id='password'
            type='password'
            required
            value={password}
            onInput={handleInput(setPassword)}
          />
        </label>
        <input type='submit' value='Login' />
      </form>
      { isLoading(session.state) && <div>Loading...</div> }
      { isFailed(session.state) && session.state.error instanceof InvalidCredentialsError
        && <div>Invalid credentials</div> }
    </>
  );
};

const LoginWrapper: FunctionComponent = () => {
  const session = useSession();
  return isLoggedIn(session)
    ? <Redirect to={ROUTES.account.replace(':id', session.account.id.toString())} />
    : <Login session={session} />;
};

export default LoginWrapper;

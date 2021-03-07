import { FunctionComponent, h } from 'preact';
import { route } from 'preact-router';
import { useCallback, useEffect, useState } from 'preact/hooks';
import ROUTES from '../constants/routes';
import { LoggedOut, useSession } from '../contexts/session';
import { isFailed, isLoading, isSuccess } from '../utils/datum';
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

  useEffect(() => {
    if (isSuccess(session.state))
      route(ROUTES.home);
  }, [session.state]);

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

  useEffect(() => {
    if (session.type === 'logged in')
      route(ROUTES.home);
  }, [session.type]);

  return session.type === 'logged in' ? null : <Login session={session} />;
};

export default LoginWrapper;

import { FunctionComponent, h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Redirect } from 'react-router-dom';
import ROUTES from '../constants/routes';
import { isLoggedIn, isLoggingIn, isLoginFailed, useSession } from '../contexts/session';
import { InvalidCredentialsError } from '../utils/errors';

const handleInput = (handler: (value: string) => void) => (event: Event) => {
  event.preventDefault();
  if (event.target instanceof HTMLInputElement) {
    handler(event.target.value);
  }
};

const Login: FunctionComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { session, login } = useSession();
  const handleSubmit = useCallback(async (event: Event) => {
    event.preventDefault();
    await login(username, password);
  }, [login, password, username]);

  if (isLoggedIn(session))
    return <Redirect to={ROUTES.account.replace(':id', session.account.id.toString())} />;

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
      { isLoggingIn(session) && <div>Loading...</div> }
      { isLoginFailed(session) && session.error instanceof InvalidCredentialsError
        && <div>Invalid credentials</div> }
    </>
  );
};

export default Login;

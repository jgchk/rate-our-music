import { FunctionComponent, h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import useLogin, { InvalidCredentialsError } from '../hooks/use-login';
import * as datum from '../utils/datum';

const handleInput = (handler: (value: string) => void) => (event: Event) => {
  event.preventDefault();
  if (event.target instanceof HTMLInputElement) {
    handler(event.target.value);
  }
};

const Login: FunctionComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, state] = useLogin();

  const handleSubmit = useCallback((event: Event) => {
    event.preventDefault();
    void login(username, password);
  }, [login, password, username]);

  useEffect(() => {
    if (datum.isComplete(state)) {
      console.log('logged in!');
    } else if (datum.isFailed(state) && !(state.error instanceof InvalidCredentialsError)) {
      console.error(state);
    }
  }, [state]);

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
      { datum.isLoading(state) && <div>Loading...</div> }
      { datum.isFailed(state) && state.error instanceof InvalidCredentialsError && <div>Invalid credentials</div> }
    </>
  );
};

export default Login;

import { FunctionComponent, h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

const handleInput = (handler: (value: string) => void) => (event: Event) => {
  event.preventDefault();
  if (event.target instanceof HTMLInputElement) {
    handler(event.target.value);
  }
};

const Login: FunctionComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback((event: Event) => {
    event.preventDefault();
    console.log(username, password);
  }, [password, username]);

  return (
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
  );
};

export default Login;

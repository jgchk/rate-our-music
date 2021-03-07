import { FunctionComponent, createContext, h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { useLogin } from '../graphql/login';
import { useLogout } from '../graphql/logout';
import { useRefresh } from '../graphql/refresh';
import useContext from '../hooks/use-context';
import { isFailed, isSuccess } from '../utils/datum';
import { GraphQLError, InvalidCredentialsError } from '../utils/errors';

const LOGOUT_KEY = 'logout';

export type Session = Initial | LoggingIn | LoginFailed | LoggedIn | LoggingOut | LoggedOut
export type Initial = { type: 'initial' }
export type LoggingIn = { type: 'logging in' }
export type LoginFailed = { type: 'login failed', error: InvalidCredentialsError | GraphQLError[] }
export type LoggedIn = { type: 'logged in' } & Auth
export type LoggingOut = { type: 'logging out' } & Auth
export type LoggedOut = { type: 'logged out' }

const initial: Initial = { type: 'initial' };
const loggingIn: LoggingIn = { type: 'logging in' };
const loginFailed = (error: InvalidCredentialsError | GraphQLError[]): LoginFailed => ({ type: 'login failed', error });
const loggedIn = (auth: Auth): LoggedIn => ({ ...auth, type: 'logged in' });
const loggingOut = (auth: Auth): LoggingOut => ({ ...auth, type: 'logging out' });
const loggedOut: LoggedOut = { type: 'logged out' };

export const isInitial = (session: Session): session is Initial => session.type === 'initial';
export const isLoggingIn = (session: Session): session is LoggingIn => session.type === 'logging in';
export const isLoginFailed = (session: Session): session is LoginFailed => session.type === 'login failed';
export const isLoggedIn = (session: Session): session is LoggedIn => session.type === 'logged in';
export const isLoggingOut = (session: Session): session is LoggingOut => session.type === 'logging out';
export const isLoggedOut = (session: Session): session is LoggedIn => session.type === 'logged out';

type Auth = {
  token: string
  exp: number,
  account: {
    id: number,
    username: string
  }
};

type SessionContext = {
  session: Session
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
const SessionContext = createContext<SessionContext | undefined>(undefined);

export const SessionProvider: FunctionComponent = ({ children }) => {
  const [login_] = useLogin();
  const [logout_] = useLogout();
  const [refresh_] = useRefresh();

  const [session, setSession] = useState<Session>(initial);

  const login = useCallback(async (username: string, password: string) => {
    setSession(loggingIn);
    const response = await login_({ variables: { username, password } });
    if (isSuccess(response)) {
      setSession(loggedIn(response.data.login));
    } else if (isFailed(response)) {
      setSession(loginFailed(response.error));
    }
  }, [login_]);

  const logout = useCallback(async () => {
    if (isLoggedIn(session)) {
      setSession(loggingOut(session));
      await logout_({ headers: { Authorization: `Bearer ${session.token}` } });
    }
    setSession(loggedOut);
    // trigger logout on other tabs
    window.localStorage.setItem(LOGOUT_KEY, new Date().toUTCString());
  }, [logout_, session]);

  const refresh = useCallback(async () => {
    const response = await refresh_();
    if (isSuccess(response)) {
      setSession(loggedIn(response.data.refreshAuth));
    } else if (isFailed(response)) {
      setSession(loggedOut);
    }
  }, [refresh_]);

  // auto logout if we log out on another tab
  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.key === LOGOUT_KEY)
        setSession(loggedOut);
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [logout_]);

  // auto refresh token when it expires
  useEffect(() => {
    if (isLoggedIn(session)) {
      const timeTillExpiration = session.exp * 1000 - Date.now();
      const timeout = setTimeout(() => void refresh(), timeTillExpiration);
      return () => clearTimeout(timeout);
    }
  }, [refresh, session]);

  // attempt to refresh token on page load
  useEffect(() => void refresh(), [refresh]);

  return (
    <SessionContext.Provider value={{ session, login, logout }}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContext => useContext(SessionContext);

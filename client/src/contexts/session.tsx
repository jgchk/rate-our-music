import { FunctionComponent, createContext, h } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { LoginResponse, useLogin } from '../graphql/login';
import { LogoutResponse, useLogout } from '../graphql/logout';
import { useRefresh } from '../graphql/refresh';
import useContext from '../hooks/use-context';
import { Datum, isFailed, isSuccess } from '../utils/datum';
import { GraphQLError, InvalidCredentialsError } from '../utils/errors';

const LOGOUT_KEY = 'logout';

export type Session = LoggingIn | LoginFailed | LoggedIn | LoggingOut | LoggedOut
export type LoggingIn = { type: 'logging in' }
export type LoginFailed = { type: 'login failed', error: InvalidCredentialsError | GraphQLError[] }
export type LoggedIn = { type: 'logged in' } & Auth
export type LoggingOut = { type: 'logging out' } & Auth
export type LoggedOut = { type: 'logged out' }

const loggingIn: LoggingIn = { type: 'logging in' };
const loginFailed = (error: InvalidCredentialsError | GraphQLError[]): LoginFailed => ({ type: 'login failed', error });
const loggedIn = (auth: Auth): LoggedIn => ({ ...auth, type: 'logged in' });
const loggingOut = (auth: Auth): LoggingOut => ({ ...auth, type: 'logging out' });
const loggedOut: LoggedOut = { type: 'logged out' };

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
  const [refresh] = useRefresh();

  const [session, setSession] = useState<Session>(loggedOut);

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

  // auto logout if we log out on another tab
  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.key === LOGOUT_KEY)
        setSession(loggedOut);
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [logout_]);

  useEffect(() => {
    if (isLoggedIn(session)) {
      const timeTillExpiration = session.exp * 1000 - Date.now();
      const re = async () => {
        const result = await refresh();
        if (isSuccess(result)) {
          setSession(loggedIn(result.data.refreshAuth));
        }
      };
      const timeout = setTimeout(() => void re(), timeTillExpiration);
      return () => clearTimeout(timeout);
    }
  }, [refresh, session]);

  return (
    <SessionContext.Provider value={{ session, login, logout }}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContext => useContext(SessionContext);

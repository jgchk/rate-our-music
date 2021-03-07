import { FunctionComponent, createContext, h } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { LoginResponse, useLogin } from '../graphql/login';
import { LogoutResponse, useLogout } from '../graphql/logout';
import useContext from '../hooks/use-context';
import { Datum, isSuccess } from '../utils/datum';
import { GraphQLError, InvalidCredentialsError } from '../utils/errors';

const LOGOUT_KEY = 'logout';

export type Session = LoggedIn | LoggedOut
export type WithState<T, D> = T & { state: Datum<D, InvalidCredentialsError | GraphQLError[]>}
export type LoggedIn = WithState<{
  type: 'logged in'
  token: string
  account: Account
  logout: () => void
}, LogoutResponse>
export type LoggedOut = WithState<{
  type: 'logged out'
  login: (username: string, password: string) => void
}, LoginResponse>

type Account = {
  id: number
  username: string
}

export const isLoggedIn = (session: Session): session is LoggedIn => session.type === 'logged in';
export const isLoggedOut = (session: Session): session is LoggedOut => session.type === 'logged out';

const SessionContext = createContext<Session | undefined>(undefined);

export const SessionProvider: FunctionComponent = ({ children }) => {
  const [login, loginState, resetLogin] = useLogin();
  const [logout, logoutState] = useLogout();

  const session: Session = useMemo(() => {
    if (isSuccess(loginState)) {
      const { token, account } = loginState.data.login;
      return {
        type: 'logged in',
        token,
        account,
        logout: async () => {
          await logout({ headers: { Authorization: `Bearer ${token}` } });
          // trigger logout on other tabs
          window.localStorage.setItem(LOGOUT_KEY, new Date().toUTCString());
          resetLogin();
        },
        state: logoutState,
      };
    } else {
      return {
        type: 'logged out',
        login: async (username: string, password: string) => {
          await login({ variables: { username, password } });
        },
        state: loginState,
      };
    }
  }, [login, loginState, logout, logoutState, resetLogin]);

  // auto logout if we log out on another tab
  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.key === LOGOUT_KEY && isLoggedIn(session)) {
        session.logout();
      }
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [session]);

  return (
    <SessionContext.Provider value={session}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSession = (): Session => useContext(SessionContext);

import { FunctionComponent, createContext, h } from 'preact';
import { useMemo } from 'preact/hooks';
import { useQuery } from '../graphql';
import { LOGIN_MUTATION, LoginResponse, LoginVariables } from '../graphql/login';
import { LOGOUT_MUTATION, LogoutResponse, LogoutVariables } from '../graphql/logout';
import useContext from '../hooks/use-context';
import { Datum } from '../utils/datum';
import { GraphQLError, InvalidCredentialsError } from '../utils/errors';

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

const SessionContext = createContext<Session | undefined>(undefined);

export const SessionProvider: FunctionComponent = ({ children }) => {
  const [login, loginState, resetLogin] = useQuery<LoginResponse, LoginVariables>(LOGIN_MUTATION);
  const [logout, logoutState] = useQuery<LogoutResponse, LogoutVariables>(LOGOUT_MUTATION);

  const session: Session = useMemo(() => {
    if (loginState.type === 'success') {
      const { token, account } = loginState.data.login;
      return {
        type: 'logged in',
        token,
        account,
        logout: async () => {
          await logout({ headers: { Authorization: `Bearer ${token}` } });
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

  return (
    <SessionContext.Provider value={session}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSession = (): Session => useContext(SessionContext);

import { useEffect, useMemo } from 'preact/hooks';
import { isLoggedIn, useSession } from '../contexts/session';
import { QueryOptions } from '../graphql';
import { isFailed } from '../utils/datum';
import { InvalidCredentialsError } from '../utils/errors';
import useGraphQL from './use-graphql';

const useSessionGraphQL = <R, V extends Record<string, string> = Record<string, never>>(
  query: string, options?: QueryOptions<V>,
) => {
  const { session, logout } = useSession();
  const headers = useMemo(
    () => isLoggedIn(session)
      ? { Authorization: `Bearer ${session.token}` }
      : {} as Record<string, never>,
    [session],
  );
  const mergedOptions = useMemo(() => ({
    ...options ?? {},
    headers: { ...options?.headers, ...headers },
  }), [headers, options]);
  const [call, state, reset] = useGraphQL<R, V>(query, mergedOptions);

  useEffect(() => {
    if (isFailed(state) && state.error instanceof InvalidCredentialsError)
      void logout();
  }, [logout, session, state]);

  return [call, state, reset] as const;
};

export default useSessionGraphQL;

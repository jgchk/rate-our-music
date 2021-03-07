import { useCallback, useMemo } from 'preact/hooks';
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

  const callWrapper = useCallback(async (innerOptions?: QueryOptions<V>) => {
    const response = await call(innerOptions);
    if (isFailed(response) && response.error instanceof InvalidCredentialsError)
      void logout();
    return response;
  }, [call, logout]);

  return [callWrapper, state, reset] as const;
};

export default useSessionGraphQL;

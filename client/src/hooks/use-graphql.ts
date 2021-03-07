import { useCallback, useState } from 'preact/hooks';
import { QueryOptions, sendQuery } from '../graphql';
import { Datum, failed, initial, loading, success } from '../utils/datum';
import { GraphQLError, InvalidCredentialsError } from '../utils/errors';

type GraphQLState<R> = Datum<R, InvalidCredentialsError | GraphQLError[]>

const useGraphQL = <R, V extends Record<string, string> = Record<string, never>>(
  query: string, options?: QueryOptions<V>,
) => {
  const [state, setState] = useState<GraphQLState<R>>(initial);

  const call = useCallback(async (innerOptions?: QueryOptions<V>) => {
    setState(loading);

    const response = await sendQuery<R, V>(query, { ...options ?? {}, ...innerOptions ?? {}  });
    const { data, errors } = response;

    const newState: GraphQLState<R> = errors
      ? (errors.some(error => error.message === 'invalid credentials')
        ? failed(new InvalidCredentialsError())
        : failed(errors))
      : success(data);
    setState(newState);

    return newState;
  }, [options, query]);

  const reset = useCallback(() => setState(initial), []);

  return [call, state, reset] as const;
};

export default useGraphQL;

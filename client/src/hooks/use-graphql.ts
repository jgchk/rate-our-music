import { useCallback, useState } from 'preact/hooks';
import { QueryOptions, sendQuery } from '../graphql';
import { Datum, failed, initial, loading, success } from '../utils/datum';
import { GraphQLError, InvalidCredentialsError } from '../utils/errors';

const useGraphQL = <R, V extends Record<string, string> = Record<string, never>>(
  query: string, options?: QueryOptions<V>,
) => {
  const [state, setState] = useState<Datum<R, InvalidCredentialsError | GraphQLError[]>>(initial);

  const call = useCallback(async (innerOptions?: QueryOptions<V>) => {
    setState(loading);

    const response = await sendQuery<R, V>(query, { ...options ?? {}, ...innerOptions ?? {}  });
    const { data, errors } = response;

    if (errors) {
      if (errors.some(error => error.message === 'invalid credentials')) {
        setState(failed(new InvalidCredentialsError()));
      } else {
        setState(failed(errors));
      }
    } else {
      setState(success(data));
    }

    return response;
  }, [options, query]);

  const reset = useCallback(() => setState(initial), []);

  return [call, state, reset] as const;
};

export default useGraphQL;

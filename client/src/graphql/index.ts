import { useCallback, useState } from 'preact/hooks';
import { Datum, failed, initial, loading, success } from '../utils/datum';
import { InvalidCredentialsError } from '../utils/errors';

type GraphQLError = {
  message: string,
  locations: {
    line: number
    column: number
  }[]
  path: string[]
}

type GraphQLResponse<R> = {
  data: R,
  errors?: GraphQLError[]
}

export type QueryOptions<V extends Record<string, string>> = { variables?: V } & Omit<RequestInit, 'method' | 'body'>

const sendQuery = async <R, V extends Record<string, string> = Record<string, never>>(
  query: string, options: QueryOptions<V> = {},
) => {
  const { headers, variables, ...requestOptions } = options;
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      ...headers ?? {},
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: variables ?? {},
    }),
    ...requestOptions ?? {},
  }).then(res => res.json() as Promise<GraphQLResponse<R>>);
};

export const useQuery = <R, V extends Record<string, string> = Record<string, never>>(
  query: string, options: QueryOptions<V> = {},
) => {
  const [state, setState] = useState<Datum<R, InvalidCredentialsError | GraphQLError[]>>(initial);

  const call = useCallback(async (opts: QueryOptions<V> = {}) => {
    setState(loading);

    const response = await sendQuery<R, V>(query, { ...options, ...opts  });
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

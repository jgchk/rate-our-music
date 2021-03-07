import { GraphQLError } from '../utils/errors';

type GraphQLResponse<R> = {
  data: R,
  errors?: GraphQLError[]
}

export type QueryVariables = Record<string, string | boolean>
export type EmptyQueryVariables = Record<string, never>
export type QueryOptions<V extends QueryVariables> = { variables?: V } & Omit<RequestInit, 'method' | 'body'>

export const sendQuery = async <R, V extends QueryVariables = EmptyQueryVariables>(
  query: string, options?: QueryOptions<V>,
) => {
  const { headers, variables, ...requestOptions } = options ?? {};
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

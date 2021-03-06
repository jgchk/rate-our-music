import { APIError, useMutation } from 'graphql-hooks';
import { useCallback, useMemo } from 'preact/hooks';
import * as datum from '../utils/datum';
import { GraphQLError } from '../utils/graphql';

const LOGIN_QUERY = `mutation Login($username: String, $password: String) {
  login(username: $username, password: $password) {
    token
    account {
      id
      username
    }
  }
}`;

type LoginVariables = {
  username: string,
  password: string
}

type LoginResponse = {
  login: {
    token: string,
    account: {
      id: number,
      username: string
    }
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('invalid credentials');
  }
}

export type UseLogin = [
  (username: string, password: string) => Promise<void>,
  datum.Datum<InvalidCredentialsError | APIError<GraphQLError>, LoginResponse['login']>
]

const useLogin = (): UseLogin => {
  const [loginMutation, { loading, error, data }] =
    useMutation<LoginResponse, LoginVariables, GraphQLError>(LOGIN_QUERY);

  const login = useCallback(
    async (username: string, password: string) => {
      await loginMutation({ variables: { username, password } });
    },
    [loginMutation],
  );

  const state = useMemo(() => {
    if (loading) return datum.loading;
    if (error) return datum.failed(
      error.graphQLErrors?.map(e => {
        console.log(e);
        return e;
      }).some(e => e.message === 'invalid credentials')
        ? new InvalidCredentialsError()
        : error);
    if (data) return datum.complete(data.login);
    return datum.initial;
  }, [data, error, loading]);

  return [login, state];
};

export default useLogin;

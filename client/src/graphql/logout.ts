import useGraphQL from '../hooks/use-graphql';

export const LOGOUT_MUTATION = `mutation {
  logout
}`;

export type LogoutVariables = Record<string, never>

export type LogoutResponse = {
  logout: true
}

export const useLogout = () => useGraphQL<LogoutResponse, LogoutVariables>(LOGOUT_MUTATION);

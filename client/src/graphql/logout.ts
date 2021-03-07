import useGraphQL from '../hooks/use-graphql';

export const LOGOUT_MUTATION = `mutation Logout($force: Boolean) {
  logout(force: $force)
}`;

export type LogoutVariables = {
  force: boolean
}

export type LogoutResponse = {
  logout: true
}

export const useLogout = () => useGraphQL<LogoutResponse, LogoutVariables>(LOGOUT_MUTATION);

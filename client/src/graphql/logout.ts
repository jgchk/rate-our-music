export const LOGOUT_MUTATION = `mutation {
  logout
}`;

export type LogoutVariables = Record<string, never>

export type LogoutResponse = {
  logout: true
}

import useGraphQL from '../hooks/use-graphql';

export const LOGIN_MUTATION = `mutation Login($username: String, $password: String) {
  login(username: $username, password: $password) {
    token
    exp
    account {
      id
      username
    }
  }
}`;

export type LoginVariables = {
  username: string,
  password: string
}

export type LoginResponse = {
  login: {
    token: string
    exp: number,
    account: {
      id: number,
      username: string
    }
  }
}

export const useLogin = () => useGraphQL<LoginResponse, LoginVariables>(LOGIN_MUTATION);

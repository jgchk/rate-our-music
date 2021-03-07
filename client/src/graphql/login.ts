export const LOGIN_MUTATION = `mutation Login($username: String, $password: String) {
  login(username: $username, password: $password) {
    token
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
    account: {
      id: number,
      username: string
    }
  }
}

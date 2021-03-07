import useGraphQL from '../hooks/use-graphql';

export const LOGIN_MUTATION = `mutation {
  refreshAuth {
    token
    exp
    account {
      id
      username
    }
  }
}`;

export type RefreshVariables = Record<string, never>

export type RefreshResponse = {
  refreshAuth: {
    token: string
    exp: number,
    account: {
      id: number,
      username: string
    }
  }
}

export const useRefresh = () => useGraphQL<RefreshResponse, RefreshVariables>(LOGIN_MUTATION);

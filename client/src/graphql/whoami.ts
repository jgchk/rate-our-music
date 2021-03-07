import useSessionGraphQL from '../hooks/use-session-graphql';

export const WHOAMI_QUERY = `{
  whoami {
    id
    username
  }
}`;

export type WhoamiResponse = {
  login: {
    id: number,
    username: string
  }
}

export const useWhoami = () => useSessionGraphQL<WhoamiResponse>(WHOAMI_QUERY);

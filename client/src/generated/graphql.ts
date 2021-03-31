import { TaskEither } from 'fp-ts/TaskEither'
import { HttpError } from '../utils/http'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Account = {
  __typename?: 'Account'
  id: Scalars['Int']
  username: Scalars['String']
}

export type AccountMutation = {
  __typename?: 'AccountMutation'
  register: Auth
  login: Auth
  logout: Scalars['Boolean']
  refreshAuth: Auth
}

export type AccountMutationRegisterArgs = {
  username: Scalars['String']
  password: Scalars['String']
}

export type AccountMutationLoginArgs = {
  username: Scalars['String']
  password: Scalars['String']
}

export type AccountMutationLogoutArgs = {
  force: Scalars['Boolean']
}

export type AccountQuery = {
  __typename?: 'AccountQuery'
  me: Account
  doesUsernameExist: Scalars['Boolean']
}

export type AccountQueryDoesUsernameExistArgs = {
  username: Scalars['String']
}

export type Artist = {
  __typename?: 'Artist'
  id: Scalars['Int']
  name: Scalars['String']
  releases: Array<Release>
}

export type ArtistInput = {
  id?: Maybe<Scalars['Int']>
  name?: Maybe<Scalars['String']>
}

export type ArtistMutation = {
  __typename?: 'ArtistMutation'
  create: Artist
}

export type ArtistMutationCreateArgs = {
  name: Scalars['String']
}

export type ArtistQuery = {
  __typename?: 'ArtistQuery'
  getOne: Artist
  filterByName: Array<Artist>
}

export type ArtistQueryGetOneArgs = {
  id: Scalars['Int']
}

export type ArtistQueryFilterByNameArgs = {
  name: Scalars['String']
}

export type Auth = {
  __typename?: 'Auth'
  token: Scalars['String']
  exp: Scalars['Int']
  account: Account
}

export type Descriptor = {
  __typename?: 'Descriptor'
  id: Scalars['Int']
  parent?: Maybe<Descriptor>
  name: Scalars['String']
  description?: Maybe<Scalars['String']>
  isGraded: Scalars['Boolean']
}

export type DescriptorVote = {
  __typename?: 'DescriptorVote'
  account: Account
  release: Release
  descriptor: Descriptor
  value: Scalars['Int']
}

export type ErrorInput = {
  message: Scalars['String']
  name: Scalars['String']
  data?: Maybe<Scalars['String']>
}

export type Genre = {
  __typename?: 'Genre'
  id: Scalars['Int']
  parent?: Maybe<Genre>
  name: Scalars['String']
  description?: Maybe<Scalars['String']>
}

export type GenreVote = {
  __typename?: 'GenreVote'
  account: Account
  release: Release
  genre: Genre
  value: Scalars['Int']
  voteType: GenreVoteType
}

export enum GenreVoteType {
  Primary = 'PRIMARY',
  Secondary = 'SECONDARY',
}

export type Log = {
  __typename?: 'Log'
  id: Scalars['Int']
  scope: Scalars['String']
  environment: LogEnvironment
  level: LogLevel
  message: Scalars['String']
}

export enum LogEnvironment {
  Development = 'DEVELOPMENT',
  Production = 'PRODUCTION',
  Unknown = 'UNKNOWN',
}

export enum LogLevel {
  Critical = 'CRITICAL',
  Error = 'ERROR',
  Warning = 'WARNING',
  Info = 'INFO',
  Debug = 'DEBUG',
}

export type LoggingMutation = {
  __typename?: 'LoggingMutation'
  errors: Array<Log>
}

export type LoggingMutationErrorsArgs = {
  scope: Scalars['String']
  environment: LogEnvironment
  errors: Array<ErrorInput>
}

export type Mutation = {
  __typename?: 'Mutation'
  account: AccountMutation
  artist: ArtistMutation
  release: ReleaseMutation
  logging: LoggingMutation
}

export type Query = {
  __typename?: 'Query'
  account: AccountQuery
  artist: ArtistQuery
  release: ReleaseQuery
}

export type Release = {
  __typename?: 'Release'
  id: Scalars['Int']
  title: Scalars['String']
  releaseDate?: Maybe<ReleaseDate>
  releaseType: ReleaseType
  artists: Array<Artist>
  tracks: Array<Track>
  genres: Array<Genre>
  genreVotes: Array<GenreVote>
  descriptorVotes: Array<DescriptorVote>
  tags: Array<Tag>
}

export type ReleaseGenresArgs = {
  voteType: GenreVoteType
}

export type ReleaseDate = {
  __typename?: 'ReleaseDate'
  year: Scalars['Int']
  month?: Maybe<Scalars['Int']>
  day?: Maybe<Scalars['Int']>
}

export type ReleaseMutation = {
  __typename?: 'ReleaseMutation'
  create: Release
}

export type ReleaseMutationCreateArgs = {
  title: Scalars['String']
  releaseType: ReleaseType
  artists: Array<ArtistInput>
}

export type ReleaseQuery = {
  __typename?: 'ReleaseQuery'
  getOne: Release
}

export type ReleaseQueryGetOneArgs = {
  id: Scalars['Int']
}

export enum ReleaseType {
  Album = 'ALBUM',
  Compilation = 'COMPILATION',
  Ep = 'EP',
  Single = 'SINGLE',
  Mixtape = 'MIXTAPE',
  DjMix = 'DJ_MIX',
  Bootleg = 'BOOTLEG',
  Video = 'VIDEO',
}

export type Tag = {
  __typename?: 'Tag'
  id: Scalars['Int']
  account: Account
  name: Scalars['String']
  description?: Maybe<Scalars['String']>
}

export type Track = {
  __typename?: 'Track'
  id: Scalars['Int']
  release: Release
  title: Scalars['String']
  num: Scalars['Int']
  durationMs?: Maybe<Scalars['Int']>
  artists: Array<Artist>
}

export type GetReleaseQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetReleaseQuery = { __typename?: 'Query' } & {
  release: { __typename?: 'ReleaseQuery' } & {
    getOne: { __typename?: 'Release' } & Pick<Release, 'id' | 'title'> & {
        artists: Array<{ __typename?: 'Artist' } & Pick<Artist, 'id' | 'name'>>
      }
  }
}

export const GetReleaseDocument = `
    query GetRelease($id: Int!) {
  release {
    getOne(id: $id) {
      id
      title
      artists {
        id
        name
      }
    }
  }
}
    `

export type GraphqlResponse<D> =
  | GraphqlSuccessResponse<D>
  | GraphqlErrorResponse

export type GraphqlSuccessResponse<D> = {
  data: D
  errors: undefined
}

export type GraphqlErrorResponse = {
  data: undefined
  errors: GraphqlErr[]
}

export type GraphqlErr = {
  locations: GraphqlErrorLocation[]
  message: string
  path: string[]
}

export type GraphqlErrorLocation = {
  line: number
  column: number
}

export const isGraphqlError = <D>(
  response: GraphqlResponse<D>
): response is GraphqlErrorResponse => !!response.errors

export class GraphqlError extends Error {
  name = 'GraphqlError'
  errors: GraphqlErr[]

  constructor(errors: GraphqlErr[], message?: string) {
    super(message)
    this.errors = errors
  }
}

export type Requester<O = Record<string, never>> = <R, V>(
  doc: string,
  vars?: V,
  options?: O
) => TaskEither<HttpError | GraphqlError, R>

export function getSdk<O>(requester: Requester<O>) {
  return {
    GetRelease(
      variables: GetReleaseQueryVariables,
      options?: O
    ): TaskEither<HttpError | GraphqlError, GetReleaseQuery> {
      return requester<GetReleaseQuery, GetReleaseQueryVariables>(
        GetReleaseDocument,
        variables,
        options
      )
    },
  }
}

export type Sdk = ReturnType<typeof getSdk>

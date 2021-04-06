import { HttpError } from '../utils/http'
import { Result } from '../utils/result'
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
  releaseReview: ReleaseReviewMutation
  trackReview: TrackReviewMutation
  logging: LoggingMutation
}

export type Query = {
  __typename?: 'Query'
  account: AccountQuery
  artist: ArtistQuery
  release: ReleaseQuery
  track: TrackQuery
}

export type Release = {
  __typename?: 'Release'
  id: Scalars['Int']
  title: Scalars['String']
  releaseDate?: Maybe<ReleaseDate>
  releaseType: ReleaseType
  coverArt?: Maybe<Scalars['String']>
  artists: Array<Artist>
  tracks: Array<Track>
  genres: Array<ReleaseGenre>
  siteRating?: Maybe<Scalars['Float']>
  friendRating: Scalars['Int']
  similarUserRating: Scalars['Int']
  reviews: Array<ReleaseReview>
  descriptorVotes: Array<DescriptorVote>
  tags: Array<Tag>
}

export type ReleaseDate = {
  __typename?: 'ReleaseDate'
  year: Scalars['Int']
  month?: Maybe<Scalars['Int']>
  day?: Maybe<Scalars['Int']>
}

export type ReleaseGenre = {
  __typename?: 'ReleaseGenre'
  id: Scalars['Int']
  parent?: Maybe<Genre>
  name: Scalars['String']
  description?: Maybe<Scalars['String']>
  weight: Scalars['Float']
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
  get: Release
}

export type ReleaseQueryGetArgs = {
  id: Scalars['Int']
}

export type ReleaseReview = {
  __typename?: 'ReleaseReview'
  id: Scalars['Int']
  release: Release
  account: Account
  rating?: Maybe<Scalars['Int']>
  text?: Maybe<Scalars['String']>
}

export type ReleaseReviewMutation = {
  __typename?: 'ReleaseReviewMutation'
  create: ReleaseReview
  updateRating: ReleaseReview
}

export type ReleaseReviewMutationCreateArgs = {
  releaseId: Scalars['Int']
  accountId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
  text?: Maybe<Scalars['String']>
}

export type ReleaseReviewMutationUpdateRatingArgs = {
  reviewId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
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
  genres: Array<TrackGenre>
  siteRating?: Maybe<Scalars['Float']>
  friendRating: Scalars['Int']
  similarUserRating: Scalars['Int']
  reviews: Array<TrackReview>
}

export type TrackGenre = {
  __typename?: 'TrackGenre'
  id: Scalars['Int']
  parent?: Maybe<Genre>
  name: Scalars['String']
  description?: Maybe<Scalars['String']>
  weight: Scalars['Float']
}

export type TrackQuery = {
  __typename?: 'TrackQuery'
  get: Track
}

export type TrackQueryGetArgs = {
  id: Scalars['Int']
}

export type TrackReview = {
  __typename?: 'TrackReview'
  id: Scalars['Int']
  track: Track
  account: Account
  rating?: Maybe<Scalars['Int']>
  text?: Maybe<Scalars['String']>
}

export type TrackReviewMutation = {
  __typename?: 'TrackReviewMutation'
  create: TrackReview
  updateRating: TrackReview
}

export type TrackReviewMutationCreateArgs = {
  trackId: Scalars['Int']
  accountId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
  text?: Maybe<Scalars['String']>
}

export type TrackReviewMutationUpdateRatingArgs = {
  reviewId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
}

export type LoginMutationVariables = Exact<{
  username: Scalars['String']
  password: Scalars['String']
}>

export type LoginMutation = { __typename?: 'Mutation' } & {
  account: { __typename?: 'AccountMutation' } & {
    login: { __typename?: 'Auth' } & Pick<Auth, 'token' | 'exp'> & {
        account: { __typename?: 'Account' } & Pick<Account, 'id' | 'username'>
      }
  }
}

export type GetReleaseQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetReleaseQuery = { __typename?: 'Query' } & {
  release: { __typename?: 'ReleaseQuery' } & {
    get: { __typename?: 'Release' } & Pick<
      Release,
      | 'id'
      | 'title'
      | 'coverArt'
      | 'siteRating'
      | 'friendRating'
      | 'similarUserRating'
    > & {
        artists: Array<{ __typename?: 'Artist' } & Pick<Artist, 'id' | 'name'>>
        releaseDate?: Maybe<
          { __typename?: 'ReleaseDate' } & Pick<
            ReleaseDate,
            'day' | 'month' | 'year'
          >
        >
        tracks: Array<
          { __typename?: 'Track' } & Pick<
            Track,
            | 'id'
            | 'title'
            | 'durationMs'
            | 'siteRating'
            | 'friendRating'
            | 'similarUserRating'
          > & {
              release: { __typename?: 'Release' } & Pick<Release, 'id'>
              artists: Array<
                { __typename?: 'Artist' } & Pick<Artist, 'id' | 'name'>
              >
              genres: Array<
                { __typename?: 'TrackGenre' } & Pick<
                  TrackGenre,
                  'id' | 'name' | 'weight'
                >
              >
              reviews: Array<
                { __typename?: 'TrackReview' } & Pick<
                  TrackReview,
                  'id' | 'rating' | 'text'
                > & {
                    account: { __typename?: 'Account' } & Pick<
                      Account,
                      'id' | 'username'
                    >
                  }
              >
            }
        >
        genres: Array<
          { __typename?: 'ReleaseGenre' } & Pick<
            ReleaseGenre,
            'id' | 'name' | 'weight'
          >
        >
        reviews: Array<
          { __typename?: 'ReleaseReview' } & Pick<
            ReleaseReview,
            'id' | 'rating' | 'text'
          > & {
              account: { __typename?: 'Account' } & Pick<
                Account,
                'id' | 'username'
              >
            }
        >
      }
  }
}

export type CreateReleaseReviewMutationVariables = Exact<{
  releaseId: Scalars['Int']
  accountId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
  text?: Maybe<Scalars['String']>
}>

export type CreateReleaseReviewMutation = { __typename?: 'Mutation' } & {
  releaseReview: { __typename?: 'ReleaseReviewMutation' } & {
    create: { __typename?: 'ReleaseReview' } & Pick<
      ReleaseReview,
      'id' | 'rating' | 'text'
    > & {
        account: { __typename?: 'Account' } & Pick<Account, 'id' | 'username'>
        release: { __typename?: 'Release' } & Pick<Release, 'id' | 'siteRating'>
      }
  }
}

export type UpdateReleaseReviewRatingMutationVariables = Exact<{
  reviewId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
}>

export type UpdateReleaseReviewRatingMutation = { __typename?: 'Mutation' } & {
  releaseReview: { __typename?: 'ReleaseReviewMutation' } & {
    updateRating: { __typename?: 'ReleaseReview' } & Pick<
      ReleaseReview,
      'id' | 'rating' | 'text'
    > & {
        account: { __typename?: 'Account' } & Pick<Account, 'id' | 'username'>
        release: { __typename?: 'Release' } & Pick<Release, 'id' | 'siteRating'>
      }
  }
}

export type CreateTrackReviewMutationVariables = Exact<{
  trackId: Scalars['Int']
  accountId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
  text?: Maybe<Scalars['String']>
}>

export type CreateTrackReviewMutation = { __typename?: 'Mutation' } & {
  trackReview: { __typename?: 'TrackReviewMutation' } & {
    create: { __typename?: 'TrackReview' } & Pick<
      TrackReview,
      'id' | 'rating' | 'text'
    > & {
        account: { __typename?: 'Account' } & Pick<Account, 'id' | 'username'>
        track: { __typename?: 'Track' } & Pick<Track, 'id'>
      }
  }
}

export type UpdateTrackReviewRatingMutationVariables = Exact<{
  reviewId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
}>

export type UpdateTrackReviewRatingMutation = { __typename?: 'Mutation' } & {
  trackReview: { __typename?: 'TrackReviewMutation' } & {
    updateRating: { __typename?: 'TrackReview' } & Pick<
      TrackReview,
      'id' | 'rating' | 'text'
    > & {
        account: { __typename?: 'Account' } & Pick<Account, 'id' | 'username'>
        track: { __typename?: 'Track' } & Pick<Track, 'id'>
      }
  }
}

export type GetTrackQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetTrackQuery = { __typename?: 'Query' } & {
  track: { __typename?: 'TrackQuery' } & {
    get: { __typename?: 'Track' } & Pick<
      Track,
      | 'id'
      | 'title'
      | 'durationMs'
      | 'siteRating'
      | 'friendRating'
      | 'similarUserRating'
    > & {
        release: { __typename?: 'Release' } & Pick<Release, 'id'>
        artists: Array<{ __typename?: 'Artist' } & Pick<Artist, 'id' | 'name'>>
        genres: Array<
          { __typename?: 'TrackGenre' } & Pick<
            TrackGenre,
            'id' | 'name' | 'weight'
          >
        >
        reviews: Array<
          { __typename?: 'TrackReview' } & Pick<
            TrackReview,
            'id' | 'rating' | 'text'
          > & {
              account: { __typename?: 'Account' } & Pick<
                Account,
                'id' | 'username'
              >
            }
        >
      }
  }
}

export const LoginDocument = `
    mutation Login($username: String!, $password: String!) {
  account {
    login(username: $username, password: $password) {
      token
      exp
      account {
        id
        username
      }
    }
  }
}
    `
export const GetReleaseDocument = `
    query GetRelease($id: Int!) {
  release {
    get(id: $id) {
      id
      title
      artists {
        id
        name
      }
      releaseDate {
        day
        month
        year
      }
      coverArt
      tracks {
        id
        title
        durationMs
        release {
          id
        }
        artists {
          id
          name
        }
        genres {
          id
          name
          weight
        }
        siteRating
        friendRating
        similarUserRating
        reviews {
          id
          account {
            id
            username
          }
          rating
          text
        }
      }
      genres {
        id
        name
        weight
      }
      siteRating
      friendRating
      similarUserRating
      reviews {
        id
        account {
          id
          username
        }
        rating
        text
      }
    }
  }
}
    `
export const CreateReleaseReviewDocument = `
    mutation CreateReleaseReview($releaseId: Int!, $accountId: Int!, $rating: Int, $text: String) {
  releaseReview {
    create(
      releaseId: $releaseId
      accountId: $accountId
      rating: $rating
      text: $text
    ) {
      id
      account {
        id
        username
      }
      rating
      text
      release {
        id
        siteRating
      }
    }
  }
}
    `
export const UpdateReleaseReviewRatingDocument = `
    mutation UpdateReleaseReviewRating($reviewId: Int!, $rating: Int) {
  releaseReview {
    updateRating(reviewId: $reviewId, rating: $rating) {
      id
      account {
        id
        username
      }
      rating
      text
      release {
        id
        siteRating
      }
    }
  }
}
    `
export const CreateTrackReviewDocument = `
    mutation CreateTrackReview($trackId: Int!, $accountId: Int!, $rating: Int, $text: String) {
  trackReview {
    create(trackId: $trackId, accountId: $accountId, rating: $rating, text: $text) {
      id
      account {
        id
        username
      }
      rating
      text
      track {
        id
      }
    }
  }
}
    `
export const UpdateTrackReviewRatingDocument = `
    mutation UpdateTrackReviewRating($reviewId: Int!, $rating: Int) {
  trackReview {
    updateRating(reviewId: $reviewId, rating: $rating) {
      id
      account {
        id
        username
      }
      rating
      text
      track {
        id
      }
    }
  }
}
    `
export const GetTrackDocument = `
    query GetTrack($id: Int!) {
  track {
    get(id: $id) {
      id
      title
      durationMs
      release {
        id
      }
      artists {
        id
        name
      }
      genres {
        id
        name
        weight
      }
      siteRating
      friendRating
      similarUserRating
      reviews {
        id
        account {
          id
          username
        }
        rating
        text
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

export const isErrorResponse = <D>(
  response: GraphqlResponse<D>
): response is GraphqlErrorResponse => !!response.errors

export type GraphqlError = {
  name: 'GraphqlError'
  message?: string
  errors: GraphqlErr[]
}

export const graphqlError = (
  errors: GraphqlErr[],
  message?: string
): GraphqlError => ({ name: 'GraphqlError', message, errors })

export const isGraphqlError = (error: any): error is GraphqlError =>
  typeof error === 'object' && error.name === 'GraphqlError'

export type Requester<O = Record<string, never>> = <R, V>(
  doc: string,
  vars?: V,
  options?: O
) => Promise<Result<HttpError | GraphqlError, R>>

export function getSdk<O>(requester: Requester<O>) {
  return {
    Login(
      variables: LoginMutationVariables,
      options?: O
    ): Promise<Result<HttpError | GraphqlError, LoginMutation>> {
      return requester<LoginMutation, LoginMutationVariables>(
        LoginDocument,
        variables,
        options
      )
    },

    GetRelease(
      variables: GetReleaseQueryVariables,
      options?: O
    ): Promise<Result<HttpError | GraphqlError, GetReleaseQuery>> {
      return requester<GetReleaseQuery, GetReleaseQueryVariables>(
        GetReleaseDocument,
        variables,
        options
      )
    },

    CreateReleaseReview(
      variables: CreateReleaseReviewMutationVariables,
      options?: O
    ): Promise<Result<HttpError | GraphqlError, CreateReleaseReviewMutation>> {
      return requester<
        CreateReleaseReviewMutation,
        CreateReleaseReviewMutationVariables
      >(CreateReleaseReviewDocument, variables, options)
    },

    UpdateReleaseReviewRating(
      variables: UpdateReleaseReviewRatingMutationVariables,
      options?: O
    ): Promise<
      Result<HttpError | GraphqlError, UpdateReleaseReviewRatingMutation>
    > {
      return requester<
        UpdateReleaseReviewRatingMutation,
        UpdateReleaseReviewRatingMutationVariables
      >(UpdateReleaseReviewRatingDocument, variables, options)
    },

    CreateTrackReview(
      variables: CreateTrackReviewMutationVariables,
      options?: O
    ): Promise<Result<HttpError | GraphqlError, CreateTrackReviewMutation>> {
      return requester<
        CreateTrackReviewMutation,
        CreateTrackReviewMutationVariables
      >(CreateTrackReviewDocument, variables, options)
    },

    UpdateTrackReviewRating(
      variables: UpdateTrackReviewRatingMutationVariables,
      options?: O
    ): Promise<
      Result<HttpError | GraphqlError, UpdateTrackReviewRatingMutation>
    > {
      return requester<
        UpdateTrackReviewRatingMutation,
        UpdateTrackReviewRatingMutationVariables
      >(UpdateTrackReviewRatingDocument, variables, options)
    },

    GetTrack(
      variables: GetTrackQueryVariables,
      options?: O
    ): Promise<Result<HttpError | GraphqlError, GetTrackQuery>> {
      return requester<GetTrackQuery, GetTrackQueryVariables>(
        GetTrackDocument,
        variables,
        options
      )
    },
  }
}

export type Sdk = ReturnType<typeof getSdk>

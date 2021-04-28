import { Result } from '../features/common/utils/result'
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
  refresh: Auth
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
  get: Account
}

export type AccountQueryGetArgs = {
  id: Scalars['Int']
}

export type Artist = {
  __typename?: 'Artist'
  id: Scalars['Int']
  name: Scalars['String']
  releases: Array<Release>
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
  get: Artist
}

export type ArtistQueryGetArgs = {
  id: Scalars['Int']
}

export type Auth = {
  __typename?: 'Auth'
  token: Scalars['String']
  exp: Scalars['Int']
  account: Account
}

export type Genre = {
  __typename?: 'Genre'
  id: Scalars['Int']
  parentId?: Maybe<Scalars['Int']>
  name: Scalars['String']
  description?: Maybe<Scalars['String']>
  parent?: Maybe<Genre>
}

export type GenreQuery = {
  __typename?: 'GenreQuery'
  get: Genre
  getByRelease: ReleaseGenre
  getByTrack: TrackGenre
}

export type GenreQueryGetArgs = {
  id: Scalars['Int']
}

export type GenreQueryGetByReleaseArgs = {
  genreId: Scalars['Int']
  releaseId: Scalars['Int']
}

export type GenreQueryGetByTrackArgs = {
  genreId: Scalars['Int']
  trackId: Scalars['Int']
}

export type Mutation = {
  __typename?: 'Mutation'
  account: AccountMutation
  artist: ArtistMutation
  releaseReview: ReleaseReviewMutation
  trackReview: TrackReviewMutation
}

export type Query = {
  __typename?: 'Query'
  account: AccountQuery
  artist: ArtistQuery
  release: ReleaseQuery
  track: TrackQuery
  genre: GenreQuery
  releaseReview: ReleaseReviewQuery
  trackReview: TrackReviewQuery
}

export type Release = {
  __typename?: 'Release'
  id: Scalars['Int']
  title: Scalars['String']
  releaseDateYear?: Maybe<Scalars['Int']>
  releaseDateMonth?: Maybe<Scalars['Int']>
  releaseDateDay?: Maybe<Scalars['Int']>
  releaseTypeId: Scalars['Int']
  coverArt?: Maybe<Scalars['String']>
  releaseDate?: Maybe<ReleaseDate>
  artists: Array<Artist>
  tracks: Array<Track>
  genres: Array<ReleaseGenre>
  siteRating?: Maybe<Scalars['Float']>
  reviews: Array<ReleaseReview>
}

export type ReleaseDate = {
  __typename?: 'ReleaseDate'
  year: Scalars['Int']
  month?: Maybe<Scalars['Int']>
  day?: Maybe<Scalars['Int']>
}

export type ReleaseGenre = {
  __typename?: 'ReleaseGenre'
  releaseId: Scalars['Int']
  genreId: Scalars['Int']
  release: Release
  genre: Genre
  weight: Scalars['Float']
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
  releaseId: Scalars['Int']
  accountId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
  text?: Maybe<Scalars['String']>
  release: Release
  account: Account
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

export type ReleaseReviewQuery = {
  __typename?: 'ReleaseReviewQuery'
  get: ReleaseReview
}

export type ReleaseReviewQueryGetArgs = {
  id: Scalars['Int']
}

export type Track = {
  __typename?: 'Track'
  id: Scalars['Int']
  releaseId: Scalars['Int']
  title: Scalars['String']
  trackNum: Scalars['Int']
  durationMs?: Maybe<Scalars['Int']>
  release: Release
  artists: Array<Artist>
  genres: Array<TrackGenre>
  siteRating?: Maybe<Scalars['Float']>
  reviews: Array<TrackReview>
}

export type TrackGenre = {
  __typename?: 'TrackGenre'
  trackId: Scalars['Int']
  genreId: Scalars['Int']
  track: Track
  genre: Genre
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
  trackId: Scalars['Int']
  accountId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
  text?: Maybe<Scalars['String']>
  track: Track
  account: Account
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

export type TrackReviewQuery = {
  __typename?: 'TrackReviewQuery'
  get: TrackReview
}

export type TrackReviewQueryGetArgs = {
  id: Scalars['Int']
}

export type AuthDataFragment = { __typename?: 'Auth' } & Pick<
  Auth,
  'token' | 'exp'
> & { account: { __typename?: 'Account' } & AccountDataFragment }

export type LoginMutationVariables = Exact<{
  username: Scalars['String']
  password: Scalars['String']
}>

export type LoginMutation = { __typename?: 'Mutation' } & {
  account: { __typename?: 'AccountMutation' } & {
    login: { __typename?: 'Auth' } & AuthDataFragment
  }
}

export type LogoutMutationVariables = Exact<{
  force: Scalars['Boolean']
}>

export type LogoutMutation = { __typename?: 'Mutation' } & {
  account: { __typename?: 'AccountMutation' } & Pick<AccountMutation, 'logout'>
}

export type RefreshMutationVariables = Exact<{ [key: string]: never }>

export type RefreshMutation = { __typename?: 'Mutation' } & {
  account: { __typename?: 'AccountMutation' } & {
    refresh: { __typename?: 'Auth' } & AuthDataFragment
  }
}

export type ArtistDataFragment = { __typename?: 'Artist' } & Pick<
  Artist,
  'id' | 'name'
>

export type GetArtistQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetArtistQuery = { __typename?: 'Query' } & {
  artist: { __typename?: 'ArtistQuery' } & {
    get: { __typename?: 'Artist' } & ArtistDataFragment
  }
}

export type ReleaseGenreDataFragment = { __typename?: 'ReleaseGenre' } & Pick<
  ReleaseGenre,
  'weight'
> & { genre: { __typename?: 'Genre' } & Pick<Genre, 'id' | 'name'> }

export type TrackGenreDataFragment = { __typename?: 'TrackGenre' } & Pick<
  TrackGenre,
  'weight'
> & { genre: { __typename?: 'Genre' } & Pick<Genre, 'id' | 'name'> }

export type GetReleaseGenreQueryVariables = Exact<{
  genreId: Scalars['Int']
  releaseId: Scalars['Int']
}>

export type GetReleaseGenreQuery = { __typename?: 'Query' } & {
  genre: { __typename?: 'GenreQuery' } & {
    getByRelease: { __typename?: 'ReleaseGenre' } & ReleaseGenreDataFragment
  }
}

export type GetTrackGenreQueryVariables = Exact<{
  genreId: Scalars['Int']
  trackId: Scalars['Int']
}>

export type GetTrackGenreQuery = { __typename?: 'Query' } & {
  genre: { __typename?: 'GenreQuery' } & {
    getByTrack: { __typename?: 'TrackGenre' } & TrackGenreDataFragment
  }
}

export type ReleaseReviewDataFragment = { __typename?: 'ReleaseReview' } & Pick<
  ReleaseReview,
  'id' | 'rating' | 'text'
> & {
    account: { __typename?: 'Account' } & AccountDataFragment
    release: { __typename?: 'Release' } & Pick<Release, 'id' | 'siteRating'>
  }

export type GetReleaseReviewQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetReleaseReviewQuery = { __typename?: 'Query' } & {
  releaseReview: { __typename?: 'ReleaseReviewQuery' } & {
    get: { __typename?: 'ReleaseReview' } & ReleaseReviewDataFragment
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
    create: { __typename?: 'ReleaseReview' } & ReleaseReviewDataFragment
  }
}

export type UpdateReleaseReviewRatingMutationVariables = Exact<{
  reviewId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
}>

export type UpdateReleaseReviewRatingMutation = { __typename?: 'Mutation' } & {
  releaseReview: { __typename?: 'ReleaseReviewMutation' } & {
    updateRating: { __typename?: 'ReleaseReview' } & ReleaseReviewDataFragment
  }
}

export type ReleaseDataFragment = { __typename?: 'Release' } & Pick<
  Release,
  'id' | 'title' | 'coverArt' | 'siteRating'
> & {
    artists: Array<{ __typename?: 'Artist' } & ArtistDataFragment>
    releaseDate?: Maybe<
      { __typename?: 'ReleaseDate' } & Pick<
        ReleaseDate,
        'day' | 'month' | 'year'
      >
    >
    tracks: Array<{ __typename?: 'Track' } & TrackDataFragment>
    genres: Array<{ __typename?: 'ReleaseGenre' } & ReleaseGenreDataFragment>
    reviews: Array<{ __typename?: 'ReleaseReview' } & ReleaseReviewDataFragment>
  }

export type GetReleaseQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetReleaseQuery = { __typename?: 'Query' } & {
  release: { __typename?: 'ReleaseQuery' } & {
    get: { __typename?: 'Release' } & ReleaseDataFragment
  }
}

export type TrackReviewDataFragment = { __typename?: 'TrackReview' } & Pick<
  TrackReview,
  'id' | 'rating' | 'text'
> & {
    account: { __typename?: 'Account' } & AccountDataFragment
    track: { __typename?: 'Track' } & Pick<Track, 'id' | 'siteRating'>
  }

export type GetTrackReviewQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetTrackReviewQuery = { __typename?: 'Query' } & {
  trackReview: { __typename?: 'TrackReviewQuery' } & {
    get: { __typename?: 'TrackReview' } & TrackReviewDataFragment
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
    create: { __typename?: 'TrackReview' } & TrackReviewDataFragment
  }
}

export type UpdateTrackReviewRatingMutationVariables = Exact<{
  reviewId: Scalars['Int']
  rating?: Maybe<Scalars['Int']>
}>

export type UpdateTrackReviewRatingMutation = { __typename?: 'Mutation' } & {
  trackReview: { __typename?: 'TrackReviewMutation' } & {
    updateRating: { __typename?: 'TrackReview' } & TrackReviewDataFragment
  }
}

export type TrackDataFragment = { __typename?: 'Track' } & Pick<
  Track,
  'id' | 'title' | 'durationMs' | 'siteRating'
> & {
    release: { __typename?: 'Release' } & Pick<Release, 'id'>
    artists: Array<{ __typename?: 'Artist' } & ArtistDataFragment>
    genres: Array<{ __typename?: 'TrackGenre' } & TrackGenreDataFragment>
    reviews: Array<{ __typename?: 'TrackReview' } & TrackReviewDataFragment>
  }

export type GetTrackQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetTrackQuery = { __typename?: 'Query' } & {
  track: { __typename?: 'TrackQuery' } & {
    get: { __typename?: 'Track' } & TrackDataFragment
  }
}

export type AccountDataFragment = { __typename?: 'Account' } & Pick<
  Account,
  'id' | 'username'
>

export type GetUserQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetUserQuery = { __typename?: 'Query' } & {
  account: { __typename?: 'AccountQuery' } & {
    get: { __typename?: 'Account' } & AccountDataFragment
  }
}

export const LoginMutationDocument = `
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
}`

export const LogoutMutationDocument = `
mutation Logout($force: Boolean!) {
  account {
    logout(force: $force)
  }
}`

export const RefreshMutationDocument = `
mutation Refresh {
  account {
    refresh {
      token
      exp
      account {
        id
        username
      }
    }
  }
}`

export const GetArtistQueryDocument = `
query GetArtist($id: Int!) {
  artist {
    get(id: $id) {
      id
      name
    }
  }
}`

export const GetReleaseGenreQueryDocument = `
query GetReleaseGenre($genreId: Int!, $releaseId: Int!) {
  genre {
    getByRelease(genreId: $genreId, releaseId: $releaseId) {
      genre {
        id
        name
      }
      weight
    }
  }
}`

export const GetTrackGenreQueryDocument = `
query GetTrackGenre($genreId: Int!, $trackId: Int!) {
  genre {
    getByTrack(genreId: $genreId, trackId: $trackId) {
      genre {
        id
        name
      }
      weight
    }
  }
}`

export const GetReleaseReviewQueryDocument = `
query GetReleaseReview($id: Int!) {
  releaseReview {
    get(id: $id) {
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
}`

export const CreateReleaseReviewMutationDocument = `
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
}`

export const UpdateReleaseReviewRatingMutationDocument = `
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
}`

export const GetReleaseQueryDocument = `
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
          genre {
            id
            name
          }
          weight
        }
        siteRating
        reviews {
          id
          account {
            id
            username
          }
          rating
          text
          track {
            id
            siteRating
          }
        }
      }
      genres {
        genre {
          id
          name
        }
        weight
      }
      siteRating
      reviews {
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
}`

export const GetTrackReviewQueryDocument = `
query GetTrackReview($id: Int!) {
  trackReview {
    get(id: $id) {
      id
      account {
        id
        username
      }
      rating
      text
      track {
        id
        siteRating
      }
    }
  }
}`

export const CreateTrackReviewMutationDocument = `
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
        siteRating
      }
    }
  }
}`

export const UpdateTrackReviewRatingMutationDocument = `
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
        siteRating
      }
    }
  }
}`

export const GetTrackQueryDocument = `
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
        genre {
          id
          name
        }
        weight
      }
      siteRating
      reviews {
        id
        account {
          id
          username
        }
        rating
        text
        track {
          id
          siteRating
        }
      }
    }
  }
}`

export const GetUserQueryDocument = `
query GetUser($id: Int!) {
  account {
    get(id: $id) {
      id
      username
    }
  }
}`

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

export const isErrorResponse = <D>(
  response: GraphqlResponse<D>
): response is GraphqlErrorResponse => !!response.errors

export type GraphqlErr = {
  locations: GraphqlErrorLocation[]
  message: string
  path: string[]
}

export type GraphqlErrorLocation = {
  line: number
  column: number
}

export type GraphqlError = {
  name: 'GraphqlError'
  message?: string
  errors: GraphqlErr[]
}

export const graphqlError = (
  errors: GraphqlErr[],
  message?: string
): GraphqlError => ({ name: 'GraphqlError', message, errors })

export type Requester<E, O = Record<string, never>> = <R, V>(
  doc: string,
  vars?: V,
  options?: O
) => Promise<Result<E, R>>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getSdk = <E, O>(requester: Requester<E, O>) => ({
  login: (
    variables: LoginMutationVariables,
    options?: O
  ): Promise<Result<E, LoginMutation>> =>
    requester<LoginMutation, LoginMutationVariables>(
      LoginMutationDocument,
      variables,
      options
    ),
  logout: (
    variables: LogoutMutationVariables,
    options?: O
  ): Promise<Result<E, LogoutMutation>> =>
    requester<LogoutMutation, LogoutMutationVariables>(
      LogoutMutationDocument,
      variables,
      options
    ),
  refresh: (
    variables: RefreshMutationVariables,
    options?: O
  ): Promise<Result<E, RefreshMutation>> =>
    requester<RefreshMutation, RefreshMutationVariables>(
      RefreshMutationDocument,
      variables,
      options
    ),
  getArtist: (
    variables: GetArtistQueryVariables,
    options?: O
  ): Promise<Result<E, GetArtistQuery>> =>
    requester<GetArtistQuery, GetArtistQueryVariables>(
      GetArtistQueryDocument,
      variables,
      options
    ),
  getReleaseGenre: (
    variables: GetReleaseGenreQueryVariables,
    options?: O
  ): Promise<Result<E, GetReleaseGenreQuery>> =>
    requester<GetReleaseGenreQuery, GetReleaseGenreQueryVariables>(
      GetReleaseGenreQueryDocument,
      variables,
      options
    ),
  getTrackGenre: (
    variables: GetTrackGenreQueryVariables,
    options?: O
  ): Promise<Result<E, GetTrackGenreQuery>> =>
    requester<GetTrackGenreQuery, GetTrackGenreQueryVariables>(
      GetTrackGenreQueryDocument,
      variables,
      options
    ),
  getReleaseReview: (
    variables: GetReleaseReviewQueryVariables,
    options?: O
  ): Promise<Result<E, GetReleaseReviewQuery>> =>
    requester<GetReleaseReviewQuery, GetReleaseReviewQueryVariables>(
      GetReleaseReviewQueryDocument,
      variables,
      options
    ),
  createReleaseReview: (
    variables: CreateReleaseReviewMutationVariables,
    options?: O
  ): Promise<Result<E, CreateReleaseReviewMutation>> =>
    requester<
      CreateReleaseReviewMutation,
      CreateReleaseReviewMutationVariables
    >(CreateReleaseReviewMutationDocument, variables, options),
  updateReleaseReviewRating: (
    variables: UpdateReleaseReviewRatingMutationVariables,
    options?: O
  ): Promise<Result<E, UpdateReleaseReviewRatingMutation>> =>
    requester<
      UpdateReleaseReviewRatingMutation,
      UpdateReleaseReviewRatingMutationVariables
    >(UpdateReleaseReviewRatingMutationDocument, variables, options),
  getRelease: (
    variables: GetReleaseQueryVariables,
    options?: O
  ): Promise<Result<E, GetReleaseQuery>> =>
    requester<GetReleaseQuery, GetReleaseQueryVariables>(
      GetReleaseQueryDocument,
      variables,
      options
    ),
  getTrackReview: (
    variables: GetTrackReviewQueryVariables,
    options?: O
  ): Promise<Result<E, GetTrackReviewQuery>> =>
    requester<GetTrackReviewQuery, GetTrackReviewQueryVariables>(
      GetTrackReviewQueryDocument,
      variables,
      options
    ),
  createTrackReview: (
    variables: CreateTrackReviewMutationVariables,
    options?: O
  ): Promise<Result<E, CreateTrackReviewMutation>> =>
    requester<CreateTrackReviewMutation, CreateTrackReviewMutationVariables>(
      CreateTrackReviewMutationDocument,
      variables,
      options
    ),
  updateTrackReviewRating: (
    variables: UpdateTrackReviewRatingMutationVariables,
    options?: O
  ): Promise<Result<E, UpdateTrackReviewRatingMutation>> =>
    requester<
      UpdateTrackReviewRatingMutation,
      UpdateTrackReviewRatingMutationVariables
    >(UpdateTrackReviewRatingMutationDocument, variables, options),
  getTrack: (
    variables: GetTrackQueryVariables,
    options?: O
  ): Promise<Result<E, GetTrackQuery>> =>
    requester<GetTrackQuery, GetTrackQueryVariables>(
      GetTrackQueryDocument,
      variables,
      options
    ),
  getUser: (
    variables: GetUserQueryVariables,
    options?: O
  ): Promise<Result<E, GetUserQuery>> =>
    requester<GetUserQuery, GetUserQueryVariables>(
      GetUserQueryDocument,
      variables,
      options
    ),
})

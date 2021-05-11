import gql from 'graphql-tag'
import * as Urql from '@urql/preact'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
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
  releaseReviews: Array<ReleaseReview>
  trackReviews: Array<TrackReview>
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

export type AccountMutationRefreshArgs = {
  refreshToken: Scalars['String']
}

export type AccountQuery = {
  __typename?: 'AccountQuery'
  get: Account
  whoami: Account
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
  search: Array<Artist>
}

export type ArtistQueryGetArgs = {
  id: Scalars['Int']
}

export type ArtistQuerySearchArgs = {
  query: Scalars['String']
}

export type Auth = {
  __typename?: 'Auth'
  token: Scalars['String']
  refreshToken: Scalars['String']
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
  getAll: Array<Genre>
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
  releases: ReleasesMutation
  release: ReleaseMutation
}

export type MutationReleaseArgs = {
  id: Scalars['Int']
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
  releaseType: ReleaseTypeQuery
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

export type ReleaseDateInput = {
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

export type ReleaseGenreMutation = {
  __typename?: 'ReleaseGenreMutation'
  vote: ReleaseGenreVote
}

export type ReleaseGenreMutationVoteArgs = {
  value: Scalars['Int']
}

export type ReleaseGenreVote = {
  __typename?: 'ReleaseGenreVote'
  accountId: Scalars['Int']
  releaseId: Scalars['Int']
  genreId: Scalars['Int']
  value: Scalars['Int']
  account: Account
  release: Release
  genre: Genre
  releaseGenre: ReleaseGenre
}

export type ReleaseInput = {
  title: Scalars['String']
  releaseDate?: Maybe<ReleaseDateInput>
  releaseTypeId: Scalars['Int']
  artistIds: Array<Scalars['Int']>
}

export type ReleaseMutation = {
  __typename?: 'ReleaseMutation'
  genre: ReleaseGenreMutation
}

export type ReleaseMutationGenreArgs = {
  id: Scalars['Int']
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

export type ReleaseType = {
  __typename?: 'ReleaseType'
  id: Scalars['Int']
  name: Scalars['String']
}

export type ReleaseTypeQuery = {
  __typename?: 'ReleaseTypeQuery'
  getAll: Array<ReleaseType>
}

export type ReleasesMutation = {
  __typename?: 'ReleasesMutation'
  add: Release
}

export type ReleasesMutationAddArgs = {
  release: ReleaseInput
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

export type SearchArtistsQueryVariables = Exact<{
  query: Scalars['String']
}>

export type SearchArtistsQuery = { __typename?: 'Query' } & {
  artist: { __typename?: 'ArtistQuery' } & {
    search: Array<{ __typename?: 'Artist' } & ArtistDataFragment>
  }
}

export type AuthDataFragment = { __typename?: 'Auth' } & Pick<
  Auth,
  'token' | 'refreshToken'
> & { account: { __typename?: 'Account' } & PartialAccountDataFragment }

export type LoginMutationVariables = Exact<{
  username: Scalars['String']
  password: Scalars['String']
}>

export type LoginMutation = { __typename?: 'Mutation' } & {
  account: { __typename?: 'AccountMutation' } & {
    login: { __typename?: 'Auth' } & AuthDataFragment
  }
}

export type LogoutMutationVariables = Exact<{ [key: string]: never }>

export type LogoutMutation = { __typename?: 'Mutation' } & {
  account: { __typename?: 'AccountMutation' } & Pick<AccountMutation, 'logout'>
}

export type RefreshMutationVariables = Exact<{
  refreshToken: Scalars['String']
}>

export type RefreshMutation = { __typename?: 'Mutation' } & {
  account: { __typename?: 'AccountMutation' } & {
    refresh: { __typename?: 'Auth' } & AuthDataFragment
  }
}

export type GenreDataFragment = { __typename?: 'Genre' } & Pick<
  Genre,
  'id' | 'name' | 'description'
>

export type GetGenreQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetGenreQuery = { __typename?: 'Query' } & {
  genre: { __typename?: 'GenreQuery' } & {
    get: { __typename?: 'Genre' } & GenreDataFragment
  }
}

export type GetAllGenresQueryVariables = Exact<{ [key: string]: never }>

export type GetAllGenresQuery = { __typename?: 'Query' } & {
  genre: { __typename?: 'GenreQuery' } & {
    getAll: Array<{ __typename?: 'Genre' } & GenreDataFragment>
  }
}

export type ReleaseGenreDataFragment = { __typename?: 'ReleaseGenre' } & Pick<
  ReleaseGenre,
  'weight'
> & { genre: { __typename?: 'Genre' } & GenreDataFragment }

export type CreateReleaseGenreVoteMutationVariables = Exact<{
  releaseId: Scalars['Int']
  genreId: Scalars['Int']
  value: Scalars['Int']
}>

export type CreateReleaseGenreVoteMutation = { __typename?: 'Mutation' } & {
  release: { __typename?: 'ReleaseMutation' } & {
    genre: { __typename?: 'ReleaseGenreMutation' } & {
      vote: { __typename?: 'ReleaseGenreVote' } & {
        release: { __typename?: 'Release' } & PartialReleaseDataFragment
      }
    }
  }
}

export type ReleaseReviewDataFragment = { __typename?: 'ReleaseReview' } & Pick<
  ReleaseReview,
  'id' | 'rating' | 'text'
> & {
    account: { __typename?: 'Account' } & PartialAccountDataFragment
    release: { __typename?: 'Release' } & Pick<
      Release,
      'id' | 'title' | 'siteRating'
    > & { artists: Array<{ __typename?: 'Artist' } & Pick<Artist, 'id'>> }
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

export type ReleaseTypeDataFragment = { __typename?: 'ReleaseType' } & Pick<
  ReleaseType,
  'id' | 'name'
>

export type GetAllReleaseTypesQueryVariables = Exact<{ [key: string]: never }>

export type GetAllReleaseTypesQuery = { __typename?: 'Query' } & {
  releaseType: { __typename?: 'ReleaseTypeQuery' } & {
    getAll: Array<{ __typename?: 'ReleaseType' } & ReleaseTypeDataFragment>
  }
}

export type PartialReleaseDataFragment = { __typename?: 'Release' } & Pick<
  Release,
  'id' | 'title' | 'coverArt'
> & {
    artists: Array<{ __typename?: 'Artist' } & ArtistDataFragment>
    releaseDate?: Maybe<
      { __typename?: 'ReleaseDate' } & Pick<
        ReleaseDate,
        'day' | 'month' | 'year'
      >
    >
    genres: Array<{ __typename?: 'ReleaseGenre' } & ReleaseGenreDataFragment>
  }

export type FullReleaseDataFragment = { __typename?: 'Release' } & Pick<
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

export type GetFullReleaseQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetFullReleaseQuery = { __typename?: 'Query' } & {
  release: { __typename?: 'ReleaseQuery' } & {
    get: { __typename?: 'Release' } & FullReleaseDataFragment
  }
}

export type AddReleaseMutationVariables = Exact<{
  release: ReleaseInput
}>

export type AddReleaseMutation = { __typename?: 'Mutation' } & {
  releases: { __typename?: 'ReleasesMutation' } & {
    add: { __typename?: 'Release' } & FullReleaseDataFragment
  }
}

export type TrackGenreDataFragment = { __typename?: 'TrackGenre' } & Pick<
  TrackGenre,
  'weight'
> & { genre: { __typename?: 'Genre' } & GenreDataFragment }

export type TrackReviewDataFragment = { __typename?: 'TrackReview' } & Pick<
  TrackReview,
  'id' | 'rating' | 'text'
> & {
    account: { __typename?: 'Account' } & PartialAccountDataFragment
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

export type GetTrackPageQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetTrackPageQuery = { __typename?: 'Query' } & {
  track: { __typename?: 'TrackQuery' } & {
    get: { __typename?: 'Track' } & Pick<
      Track,
      'id' | 'title' | 'durationMs' | 'siteRating'
    > & {
        release: { __typename?: 'Release' } & Pick<
          Release,
          'id' | 'coverArt'
        > & {
            tracks: Array<{ __typename?: 'Track' } & Pick<Track, 'id'>>
            releaseDate?: Maybe<
              { __typename?: 'ReleaseDate' } & Pick<
                ReleaseDate,
                'year' | 'month' | 'day'
              >
            >
          }
        artists: Array<{ __typename?: 'Artist' } & ArtistDataFragment>
        genres: Array<{ __typename?: 'TrackGenre' } & TrackGenreDataFragment>
        reviews: Array<{ __typename?: 'TrackReview' } & TrackReviewDataFragment>
      }
  }
}

export type GetPartialTrackQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetPartialTrackQuery = { __typename?: 'Query' } & {
  track: { __typename?: 'TrackQuery' } & {
    get: { __typename?: 'Track' } & Pick<
      Track,
      'trackNum' | 'durationMs' | 'title'
    >
  }
}

export type PartialAccountDataFragment = { __typename?: 'Account' } & Pick<
  Account,
  'id' | 'username'
>

export type FullAccountDataFragment = { __typename?: 'Account' } & Pick<
  Account,
  'id' | 'username'
> & {
    releaseReviews: Array<
      { __typename?: 'ReleaseReview' } & {
        release: { __typename?: 'Release' } & PartialReleaseDataFragment
      } & ReleaseReviewDataFragment
    >
    trackReviews: Array<
      { __typename?: 'TrackReview' } & TrackReviewDataFragment
    >
  }

export type GetPartialUserQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetPartialUserQuery = { __typename?: 'Query' } & {
  account: { __typename?: 'AccountQuery' } & {
    get: { __typename?: 'Account' } & PartialAccountDataFragment
  }
}

export type GetFullUserQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GetFullUserQuery = { __typename?: 'Query' } & {
  account: { __typename?: 'AccountQuery' } & {
    get: { __typename?: 'Account' } & FullAccountDataFragment
  }
}

export type WhoAmIQueryVariables = Exact<{ [key: string]: never }>

export type WhoAmIQuery = { __typename?: 'Query' } & {
  account: { __typename?: 'AccountQuery' } & {
    whoami: { __typename?: 'Account' } & PartialAccountDataFragment
  }
}

export const PartialAccountDataFragmentDoc = gql`
  fragment partialAccountData on Account {
    id
    username
  }
`
export const AuthDataFragmentDoc = gql`
  fragment authData on Auth {
    token
    refreshToken
    account {
      ...partialAccountData
    }
  }
  ${PartialAccountDataFragmentDoc}
`
export const ReleaseTypeDataFragmentDoc = gql`
  fragment releaseTypeData on ReleaseType {
    id
    name
  }
`
export const ArtistDataFragmentDoc = gql`
  fragment artistData on Artist {
    id
    name
  }
`
export const GenreDataFragmentDoc = gql`
  fragment genreData on Genre {
    id
    name
    description
  }
`
export const TrackGenreDataFragmentDoc = gql`
  fragment trackGenreData on TrackGenre {
    genre {
      ...genreData
    }
    weight
  }
  ${GenreDataFragmentDoc}
`
export const TrackReviewDataFragmentDoc = gql`
  fragment trackReviewData on TrackReview {
    id
    account {
      ...partialAccountData
    }
    rating
    text
    track {
      id
      siteRating
    }
  }
  ${PartialAccountDataFragmentDoc}
`
export const TrackDataFragmentDoc = gql`
  fragment trackData on Track {
    id
    title
    durationMs
    release {
      id
    }
    artists {
      ...artistData
    }
    genres {
      ...trackGenreData
    }
    siteRating
    reviews {
      ...trackReviewData
    }
  }
  ${ArtistDataFragmentDoc}
  ${TrackGenreDataFragmentDoc}
  ${TrackReviewDataFragmentDoc}
`
export const ReleaseGenreDataFragmentDoc = gql`
  fragment releaseGenreData on ReleaseGenre {
    genre {
      ...genreData
    }
    weight
  }
  ${GenreDataFragmentDoc}
`
export const ReleaseReviewDataFragmentDoc = gql`
  fragment releaseReviewData on ReleaseReview {
    id
    account {
      ...partialAccountData
    }
    rating
    text
    release {
      id
      title
      siteRating
      artists {
        id
      }
    }
  }
  ${PartialAccountDataFragmentDoc}
`
export const FullReleaseDataFragmentDoc = gql`
  fragment fullReleaseData on Release {
    id
    title
    artists {
      ...artistData
    }
    releaseDate {
      day
      month
      year
    }
    coverArt
    tracks {
      ...trackData
    }
    genres {
      ...releaseGenreData
    }
    siteRating
    reviews {
      ...releaseReviewData
    }
  }
  ${ArtistDataFragmentDoc}
  ${TrackDataFragmentDoc}
  ${ReleaseGenreDataFragmentDoc}
  ${ReleaseReviewDataFragmentDoc}
`
export const PartialReleaseDataFragmentDoc = gql`
  fragment partialReleaseData on Release {
    id
    title
    artists {
      ...artistData
    }
    releaseDate {
      day
      month
      year
    }
    coverArt
    genres {
      ...releaseGenreData
    }
  }
  ${ArtistDataFragmentDoc}
  ${ReleaseGenreDataFragmentDoc}
`
export const FullAccountDataFragmentDoc = gql`
  fragment fullAccountData on Account {
    id
    username
    releaseReviews {
      ...releaseReviewData
      release {
        ...partialReleaseData
      }
    }
    trackReviews {
      ...trackReviewData
    }
  }
  ${ReleaseReviewDataFragmentDoc}
  ${PartialReleaseDataFragmentDoc}
  ${TrackReviewDataFragmentDoc}
`
export const GetArtistDocument = gql`
  query GetArtist($id: Int!) {
    artist {
      get(id: $id) {
        ...artistData
      }
    }
  }
  ${ArtistDataFragmentDoc}
`

export function useGetArtistQuery(
  options: Omit<Urql.UseQueryArgs<GetArtistQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetArtistQuery>({ query: GetArtistDocument, ...options })
}
export const SearchArtistsDocument = gql`
  query SearchArtists($query: String!) {
    artist {
      search(query: $query) {
        ...artistData
      }
    }
  }
  ${ArtistDataFragmentDoc}
`

export function useSearchArtistsQuery(
  options: Omit<Urql.UseQueryArgs<SearchArtistsQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<SearchArtistsQuery>({
    query: SearchArtistsDocument,
    ...options,
  })
}
export const LoginDocument = gql`
  mutation Login($username: String!, $password: String!) {
    account {
      login(username: $username, password: $password) {
        ...authData
      }
    }
  }
  ${AuthDataFragmentDoc}
`

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument)
}
export const LogoutDocument = gql`
  mutation Logout {
    account {
      logout
    }
  }
`

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument
  )
}
export const RefreshDocument = gql`
  mutation Refresh($refreshToken: String!) {
    account {
      refresh(refreshToken: $refreshToken) {
        ...authData
      }
    }
  }
  ${AuthDataFragmentDoc}
`

export function useRefreshMutation() {
  return Urql.useMutation<RefreshMutation, RefreshMutationVariables>(
    RefreshDocument
  )
}
export const GetGenreDocument = gql`
  query GetGenre($id: Int!) {
    genre {
      get(id: $id) {
        ...genreData
      }
    }
  }
  ${GenreDataFragmentDoc}
`

export function useGetGenreQuery(
  options: Omit<Urql.UseQueryArgs<GetGenreQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetGenreQuery>({ query: GetGenreDocument, ...options })
}
export const GetAllGenresDocument = gql`
  query GetAllGenres {
    genre {
      getAll {
        ...genreData
      }
    }
  }
  ${GenreDataFragmentDoc}
`

export function useGetAllGenresQuery(
  options: Omit<Urql.UseQueryArgs<GetAllGenresQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetAllGenresQuery>({
    query: GetAllGenresDocument,
    ...options,
  })
}
export const CreateReleaseGenreVoteDocument = gql`
  mutation CreateReleaseGenreVote(
    $releaseId: Int!
    $genreId: Int!
    $value: Int!
  ) {
    release(id: $releaseId) {
      genre(id: $genreId) {
        vote(value: $value) {
          release {
            ...partialReleaseData
          }
        }
      }
    }
  }
  ${PartialReleaseDataFragmentDoc}
`

export function useCreateReleaseGenreVoteMutation() {
  return Urql.useMutation<
    CreateReleaseGenreVoteMutation,
    CreateReleaseGenreVoteMutationVariables
  >(CreateReleaseGenreVoteDocument)
}
export const GetReleaseReviewDocument = gql`
  query GetReleaseReview($id: Int!) {
    releaseReview {
      get(id: $id) {
        ...releaseReviewData
      }
    }
  }
  ${ReleaseReviewDataFragmentDoc}
`

export function useGetReleaseReviewQuery(
  options: Omit<Urql.UseQueryArgs<GetReleaseReviewQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetReleaseReviewQuery>({
    query: GetReleaseReviewDocument,
    ...options,
  })
}
export const CreateReleaseReviewDocument = gql`
  mutation CreateReleaseReview(
    $releaseId: Int!
    $accountId: Int!
    $rating: Int
    $text: String
  ) {
    releaseReview {
      create(
        releaseId: $releaseId
        accountId: $accountId
        rating: $rating
        text: $text
      ) {
        ...releaseReviewData
      }
    }
  }
  ${ReleaseReviewDataFragmentDoc}
`

export function useCreateReleaseReviewMutation() {
  return Urql.useMutation<
    CreateReleaseReviewMutation,
    CreateReleaseReviewMutationVariables
  >(CreateReleaseReviewDocument)
}
export const UpdateReleaseReviewRatingDocument = gql`
  mutation UpdateReleaseReviewRating($reviewId: Int!, $rating: Int) {
    releaseReview {
      updateRating(reviewId: $reviewId, rating: $rating) {
        ...releaseReviewData
      }
    }
  }
  ${ReleaseReviewDataFragmentDoc}
`

export function useUpdateReleaseReviewRatingMutation() {
  return Urql.useMutation<
    UpdateReleaseReviewRatingMutation,
    UpdateReleaseReviewRatingMutationVariables
  >(UpdateReleaseReviewRatingDocument)
}
export const GetAllReleaseTypesDocument = gql`
  query GetAllReleaseTypes {
    releaseType {
      getAll {
        ...releaseTypeData
      }
    }
  }
  ${ReleaseTypeDataFragmentDoc}
`

export function useGetAllReleaseTypesQuery(
  options: Omit<
    Urql.UseQueryArgs<GetAllReleaseTypesQueryVariables>,
    'query'
  > = {}
) {
  return Urql.useQuery<GetAllReleaseTypesQuery>({
    query: GetAllReleaseTypesDocument,
    ...options,
  })
}
export const GetFullReleaseDocument = gql`
  query GetFullRelease($id: Int!) {
    release {
      get(id: $id) {
        ...fullReleaseData
      }
    }
  }
  ${FullReleaseDataFragmentDoc}
`

export function useGetFullReleaseQuery(
  options: Omit<Urql.UseQueryArgs<GetFullReleaseQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetFullReleaseQuery>({
    query: GetFullReleaseDocument,
    ...options,
  })
}
export const AddReleaseDocument = gql`
  mutation AddRelease($release: ReleaseInput!) {
    releases {
      add(release: $release) {
        ...fullReleaseData
      }
    }
  }
  ${FullReleaseDataFragmentDoc}
`

export function useAddReleaseMutation() {
  return Urql.useMutation<AddReleaseMutation, AddReleaseMutationVariables>(
    AddReleaseDocument
  )
}
export const GetTrackReviewDocument = gql`
  query GetTrackReview($id: Int!) {
    trackReview {
      get(id: $id) {
        ...trackReviewData
      }
    }
  }
  ${TrackReviewDataFragmentDoc}
`

export function useGetTrackReviewQuery(
  options: Omit<Urql.UseQueryArgs<GetTrackReviewQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetTrackReviewQuery>({
    query: GetTrackReviewDocument,
    ...options,
  })
}
export const CreateTrackReviewDocument = gql`
  mutation CreateTrackReview(
    $trackId: Int!
    $accountId: Int!
    $rating: Int
    $text: String
  ) {
    trackReview {
      create(
        trackId: $trackId
        accountId: $accountId
        rating: $rating
        text: $text
      ) {
        ...trackReviewData
      }
    }
  }
  ${TrackReviewDataFragmentDoc}
`

export function useCreateTrackReviewMutation() {
  return Urql.useMutation<
    CreateTrackReviewMutation,
    CreateTrackReviewMutationVariables
  >(CreateTrackReviewDocument)
}
export const UpdateTrackReviewRatingDocument = gql`
  mutation UpdateTrackReviewRating($reviewId: Int!, $rating: Int) {
    trackReview {
      updateRating(reviewId: $reviewId, rating: $rating) {
        ...trackReviewData
      }
    }
  }
  ${TrackReviewDataFragmentDoc}
`

export function useUpdateTrackReviewRatingMutation() {
  return Urql.useMutation<
    UpdateTrackReviewRatingMutation,
    UpdateTrackReviewRatingMutationVariables
  >(UpdateTrackReviewRatingDocument)
}
export const GetTrackPageDocument = gql`
  query GetTrackPage($id: Int!) {
    track {
      get(id: $id) {
        id
        title
        durationMs
        release {
          id
          coverArt
          tracks {
            id
          }
          releaseDate {
            year
            month
            day
          }
        }
        artists {
          ...artistData
        }
        genres {
          ...trackGenreData
        }
        siteRating
        reviews {
          ...trackReviewData
        }
      }
    }
  }
  ${ArtistDataFragmentDoc}
  ${TrackGenreDataFragmentDoc}
  ${TrackReviewDataFragmentDoc}
`

export function useGetTrackPageQuery(
  options: Omit<Urql.UseQueryArgs<GetTrackPageQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetTrackPageQuery>({
    query: GetTrackPageDocument,
    ...options,
  })
}
export const GetPartialTrackDocument = gql`
  query GetPartialTrack($id: Int!) {
    track {
      get(id: $id) {
        trackNum
        durationMs
        title
      }
    }
  }
`

export function useGetPartialTrackQuery(
  options: Omit<Urql.UseQueryArgs<GetPartialTrackQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetPartialTrackQuery>({
    query: GetPartialTrackDocument,
    ...options,
  })
}
export const GetPartialUserDocument = gql`
  query GetPartialUser($id: Int!) {
    account {
      get(id: $id) {
        ...partialAccountData
      }
    }
  }
  ${PartialAccountDataFragmentDoc}
`

export function useGetPartialUserQuery(
  options: Omit<Urql.UseQueryArgs<GetPartialUserQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetPartialUserQuery>({
    query: GetPartialUserDocument,
    ...options,
  })
}
export const GetFullUserDocument = gql`
  query GetFullUser($id: Int!) {
    account {
      get(id: $id) {
        ...fullAccountData
      }
    }
  }
  ${FullAccountDataFragmentDoc}
`

export function useGetFullUserQuery(
  options: Omit<Urql.UseQueryArgs<GetFullUserQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetFullUserQuery>({
    query: GetFullUserDocument,
    ...options,
  })
}
export const WhoAmIDocument = gql`
  query WhoAmI {
    account {
      whoami {
        ...partialAccountData
      }
    }
  }
  ${PartialAccountDataFragmentDoc}
`

export function useWhoAmIQuery(
  options: Omit<Urql.UseQueryArgs<WhoAmIQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<WhoAmIQuery>({ query: WhoAmIDocument, ...options })
}

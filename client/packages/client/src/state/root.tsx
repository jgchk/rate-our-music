import { ActionsState, actionsReducer } from './actions'
import { ArtistActions, ArtistsState, artistsReducer } from './slices/artists'
import { AuthActions, AuthState, authReducer } from './slices/auth'
import { GenreActions, GenresState, genresReducer } from './slices/genres'
import {
  ReleaseReviewActions,
  ReleaseReviewsState,
  releaseReviewsReducer,
} from './slices/release-reviews'
import {
  ReleaseTypeActions,
  ReleaseTypesState,
  releaseTypesReducer,
} from './slices/release-types'
import {
  ReleaseActions,
  ReleasesState,
  releasesReducer,
} from './slices/releases'
import {
  TrackReviewActions,
  TrackReviewsState,
  trackReviewsReducer,
} from './slices/track-reviews'
import { TrackActions, TracksState, tracksReducer } from './slices/tracks'
import { UserActions, UsersState, usersReducer } from './slices/users'
import { InitAction, Reducer } from './store'

export type RootState = {
  actions: ActionsState
  users: UsersState
  releases: ReleasesState
  artists: ArtistsState
  tracks: TracksState
  genres: GenresState
  releaseReviews: ReleaseReviewsState
  trackReviews: TrackReviewsState
  releaseTypes: ReleaseTypesState
  auth: AuthState
}

export type RootAction =
  | InitAction
  | AuthActions
  | ReleaseActions
  | TrackActions
  | ReleaseReviewActions
  | TrackReviewActions
  | ArtistActions
  | GenreActions
  | UserActions
  | ReleaseTypeActions

export const appReducer: Reducer<RootState> = (state, action) => ({
  actions: actionsReducer(state?.actions, action),
  users: usersReducer(state?.users, action),
  releases: releasesReducer(state?.releases, action),
  artists: artistsReducer(state?.artists, action),
  tracks: tracksReducer(state?.tracks, action),
  genres: genresReducer(state?.genres, action),
  releaseReviews: releaseReviewsReducer(state?.releaseReviews, action),
  trackReviews: trackReviewsReducer(state?.trackReviews, action),
  releaseTypes: releaseTypesReducer(state?.releaseTypes, action),
  auth: authReducer(state?.auth, action),
})

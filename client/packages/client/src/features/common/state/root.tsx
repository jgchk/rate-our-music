import { AuthActions, AuthState, authReducer } from '../../auth/state/auth'
import {
  ArtistActions,
  ArtistsState,
  artistsReducer,
} from '../../release/state/artists'
import {
  GenreActions,
  GenresState,
  genresReducer,
} from '../../release/state/genres'
import {
  ReleaseReviewActions,
  ReleaseReviewsState,
  releaseReviewsReducer,
} from '../../release/state/release-reviews'
import {
  ReleaseActions,
  ReleasesState,
  releasesReducer,
} from '../../release/state/releases'
import {
  TrackReviewActions,
  TrackReviewsState,
  trackReviewsReducer,
} from '../../release/state/track-reviews'
import {
  TrackActions,
  TracksState,
  tracksReducer,
} from '../../release/state/tracks'
import {
  UserActions,
  UsersState,
  usersReducer,
} from '../../release/state/users'
import { ActionsState, actionsReducer } from './actions'
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

export const appReducer: Reducer<RootState> = (state, action) => ({
  actions: actionsReducer(state?.actions, action),
  users: usersReducer(state?.users, action),
  releases: releasesReducer(state?.releases, action),
  artists: artistsReducer(state?.artists, action),
  tracks: tracksReducer(state?.tracks, action),
  genres: genresReducer(state?.genres, action),
  releaseReviews: releaseReviewsReducer(state?.releaseReviews, action),
  trackReviews: trackReviewsReducer(state?.trackReviews, action),
  auth: authReducer(state?.auth, action),
})

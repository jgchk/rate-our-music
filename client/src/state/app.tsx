import { ActionsState, actionsReducer } from './slices/actions'
import { ArtistsState, artistsReducer } from './slices/artists'
import { AuthState, authReducer } from './slices/auth'
import { GenresState, genresReducer } from './slices/genres'
import {
  ReleaseReviewsState,
  releaseReviewsReducer,
} from './slices/release-reviews'
import { ReleasesState, releasesReducer } from './slices/releases'
import { TrackReviewsState, trackReviewsReducer } from './slices/track-reviews'
import { TracksState, tracksReducer } from './slices/tracks'
import { UsersState, usersReducer } from './slices/users'
import { Reducer } from './store'

export type AppState = {
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

export const appReducer: Reducer<AppState> = (state, action) => ({
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

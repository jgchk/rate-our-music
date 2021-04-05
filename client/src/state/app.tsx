import { ActionsState, actionsReducer } from './slices/actions'
import { ArtistsState, artistsReducer } from './slices/artists'
import { AuthState, authReducer } from './slices/auth'
import { GenresState, genresReducer } from './slices/genres'
import { ReleasesState, releasesReducer } from './slices/releases'
import { ReviewsState, reviewsReducer } from './slices/reviews'
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
  reviews: ReviewsState
  auth: AuthState
}

export const appReducer: Reducer<AppState> = (state, action) => ({
  actions: actionsReducer(state?.actions, action),
  users: usersReducer(state?.users, action),
  releases: releasesReducer(state?.releases, action),
  artists: artistsReducer(state?.artists, action),
  tracks: tracksReducer(state?.tracks, action),
  genres: genresReducer(state?.genres, action),
  reviews: reviewsReducer(state?.reviews, action),
  auth: authReducer(state?.auth, action),
})

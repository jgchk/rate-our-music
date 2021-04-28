import {
  GetReleaseGenreQuery,
  GetTrackGenreQuery,
} from '../../generated/graphql'
import { GraphqlRequestError, graphql } from '../../utils/graphql'
import {
  RemoteData,
  fromResult,
  isSuccess,
  loading,
} from '../../utils/remote-data'
import { mergeIds } from '../../utils/state'
import { Reducer } from '../store'

//
// Types
//

export type GenresState = {
  [id: number]: Genre
}

export type Genre = {
  id: number
  name: string
}

//
// Reducer
//

export const genresReducer: Reducer<GenresState> = (state, action) => {
  if (state === undefined) {
    const initialState: GenresState = {}
    return initialState
  }

  switch (action._type) {
    case 'release/getFull': {
      if (!isSuccess(action.request)) return state
      const genres: Genre[] = action.request.data.release.get.genres.map(
        (genre) => genre.genre
      )
      return mergeIds(state, genres)
    }

    case 'track/get': {
      if (!isSuccess(action.request)) return state
      const genres: Genre[] = action.request.data.track.get.genres.map(
        (genre) => genre.genre
      )
      return mergeIds(state, genres)
    }

    default:
      return state
  }
}

//
// Actions
//

export type GenreActions = GetReleaseGenreAction | GetTrackGenreAction

export type GetReleaseGenreAction = {
  _type: 'genre/release/get'
  request: RemoteData<GraphqlRequestError, GetReleaseGenreQuery>
}
export const getReleaseGenre = async function* (
  genreId: number,
  releaseId: number
): AsyncGenerator<GetReleaseGenreAction> {
  yield { _type: 'genre/release/get', request: loading }
  const response = await graphql.getReleaseGenre({ genreId, releaseId })
  yield { _type: 'genre/release/get', request: fromResult(response) }
}

export type GetTrackGenreAction = {
  _type: 'genre/track/get'
  request: RemoteData<GraphqlRequestError, GetTrackGenreQuery>
}
export const getTrackGenre = async function* (
  genreId: number,
  trackId: number
): AsyncGenerator<GetTrackGenreAction> {
  yield { _type: 'genre/track/get', request: loading }
  const response = await graphql.getTrackGenre({ genreId, trackId })
  yield { _type: 'genre/track/get', request: fromResult(response) }
}

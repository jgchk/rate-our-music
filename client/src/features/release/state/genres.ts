import {
  GetReleaseGenreQuery,
  GetTrackGenreQuery,
  GraphqlError,
} from '../../../generated/graphql'
import { Reducer } from '../../common/state/store'
import { gql } from '../../common/utils/gql'
import { HttpError } from '../../common/utils/http'
import {
  RemoteData,
  fromResult,
  isSuccess,
  loading,
} from '../../common/utils/remote-data'
import { mergeIds } from '../../common/utils/state'

//
// Types
//

export type GenresState = {
  [id: number]: Genre
}

export type Genre = {
  id: number
  name: string
  weight: number
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
    case 'release/get': {
      if (!isSuccess(action.request)) return state
      const genres: Genre[] = action.request.data.release.get.genres
      return mergeIds(state, genres)
    }

    case 'track/get': {
      if (!isSuccess(action.request)) return state
      const genres: Genre[] = action.request.data.track.get.genres
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
  request: RemoteData<HttpError | GraphqlError, GetReleaseGenreQuery>
}
export const getReleaseGenre = async function* (
  genreId: number,
  releaseId: number
): AsyncGenerator<GetReleaseGenreAction> {
  yield { _type: 'genre/release/get', request: loading }
  const response = await gql.GetReleaseGenre({ genreId, releaseId })
  yield { _type: 'genre/release/get', request: fromResult(response) }
}

export type GetTrackGenreAction = {
  _type: 'genre/track/get'
  request: RemoteData<HttpError | GraphqlError, GetTrackGenreQuery>
}
export const getTrackGenre = async function* (
  genreId: number,
  trackId: number
): AsyncGenerator<GetTrackGenreAction> {
  yield { _type: 'genre/track/get', request: loading }
  const response = await gql.GetTrackGenre({ genreId, trackId })
  yield { _type: 'genre/track/get', request: fromResult(response) }
}

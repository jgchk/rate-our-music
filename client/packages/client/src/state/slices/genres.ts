import {
  GenreDataFragment,
  GetAllGenresQuery,
  GetGenreQuery,
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
  genres: { [id: number]: Genre }
  lastFetchedAll: Date | undefined
}

export type Genre = {
  id: number
  name: string
  description?: string
}

//
// Mappers
//

const mapGenre = (genre: GenreDataFragment): Genre => ({
  id: genre.id,
  name: genre.name,
  description: genre.description ?? undefined,
})

//
// Reducer
//

export const genresReducer: Reducer<GenresState> = (state, action) => {
  if (state === undefined) {
    const initialState: GenresState = { genres: {}, lastFetchedAll: undefined }
    return initialState
  }

  switch (action._type) {
    case 'genre/get': {
      if (!isSuccess(action.request)) return state
      const genre = mapGenre(action.request.data.genre.get)
      return { ...state, genres: mergeIds(state.genres, [genre]) }
    }

    case 'genre/getAll': {
      if (!isSuccess(action.request)) return state
      const genres = action.request.data.genre.getAll.map(mapGenre)
      return {
        ...state,
        genres: mergeIds(state.genres, genres),
        lastFetchedAll: new Date(),
      }
    }

    case 'release/getFull': {
      if (!isSuccess(action.request)) return state
      const genres: Genre[] = action.request.data.release.get.genres.map(
        (genre) => mapGenre(genre.genre)
      )
      return { ...state, genres: mergeIds(state.genres, genres) }
    }

    case 'track/get': {
      if (!isSuccess(action.request)) return state
      const genres: Genre[] = action.request.data.track.get.genres.map(
        (genre) => mapGenre(genre.genre)
      )
      return { ...state, genres: mergeIds(state.genres, genres) }
    }

    default:
      return state
  }
}

//
// Actions
//

export type GenreActions = GetGenreAction | GetAllGenresAction

export type GetGenreAction = {
  _type: 'genre/get'
  request: RemoteData<GraphqlRequestError, GetGenreQuery>
}
export const getGenre = async function* (
  id: number
): AsyncGenerator<GetGenreAction> {
  yield { _type: 'genre/get', request: loading }
  const response = await graphql.getGenre({ id })
  yield { _type: 'genre/get', request: fromResult(response) }
}

export type GetAllGenresAction = {
  _type: 'genre/getAll'
  request: RemoteData<GraphqlRequestError, GetAllGenresQuery>
}
export const getAllGenres = async function* (): AsyncGenerator<GetAllGenresAction> {
  yield { _type: 'genre/getAll', request: loading }
  const response = await graphql.getAllGenres({})
  yield { _type: 'genre/getAll', request: fromResult(response) }
}

import { isSuccess } from '../../utils/remote-data'
import { Reducer } from '../store'
import { mergeIds } from './utils'

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

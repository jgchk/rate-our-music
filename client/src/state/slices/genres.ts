import { isSuccess } from '../../utils/remote-data'
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

      const response = action.request.data.release.get
      const genres: Genre[] = response.genres

      let nextState = { ...state }
      for (const genre of genres) {
        nextState = {
          ...nextState,
          [genre.id]: genre,
        }
      }
      return nextState
    }

    case 'track/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.track.get
      const genres: Genre[] = response.genres

      let nextState = { ...state }
      for (const genre of genres) {
        nextState = {
          ...nextState,
          [genre.id]: genre,
        }
      }
      return nextState
    }

    default:
      return state
  }
}

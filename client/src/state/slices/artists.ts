import { isSuccess } from '../../utils/remote-data'
import { Reducer } from '../store'

//
// Types
//

export type ArtistsState = {
  [id: number]: Artist
}

export type Artist = {
  id: number
  name: string
}

//
// Reducer
//

export const artistsReducer: Reducer<ArtistsState> = (state, action) => {
  if (state === undefined) {
    const initialState: ArtistsState = {}
    return initialState
  }

  switch (action._type) {
    case 'release/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.release.get
      const artists: Artist[] = response.artists

      let nextState = { ...state }
      for (const artist of artists) {
        nextState = {
          ...nextState,
          [artist.id]: artist,
        }
      }
      return nextState
    }

    case 'track/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.track.get
      const artists: Artist[] = response.artists

      let nextState = { ...state }
      for (const artist of artists) {
        nextState = {
          ...nextState,
          [artist.id]: artist,
        }
      }
      return nextState
    }

    default:
      return state
  }
}

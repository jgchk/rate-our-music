import { isSuccess } from '../../utils/remote-data'
import { Reducer } from '../store'
import { ids } from './utils'

//
// Types
//

export type TracksState = {
  [id: number]: Track
}

export type Track = {
  id: number
  title: string
  durationMs: number | undefined
  reviews: Set<number>
}

//
// Reducer
//

export const tracksReducer: Reducer<TracksState> = (state, action) => {
  if (state === undefined) {
    const initialState: TracksState = {}
    return initialState
  }

  switch (action._type) {
    case 'release/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.release.getOne
      const tracks: Track[] = response.tracks.map((track) => ({
        id: track.id,
        title: track.title,
        durationMs: track.durationMs ?? undefined,
        reviews: ids(track.reviews),
      }))

      let nextState = { ...state }
      for (const track of tracks) {
        nextState = {
          ...nextState,
          [track.id]: track,
        }
      }
      return nextState
    }

    default:
      return state
  }
}

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

    case 'review/track/create': {
      if (!isSuccess(action.request)) return state

      const review = action.request.data.trackReview.create

      const track = state[review.track.id]
      if (track === undefined) {
        console.error(`could not find track id: ${review.track.id}`)
        return state
      }

      return {
        ...state,
        [track.id]: {
          ...track,
          reviews: track.reviews.add(review.id),
          // TODO: siteRating: review.release.siteRating ?? undefined,
        },
      }
    }
    case 'review/track/update': {
      if (!isSuccess(action.request)) return state

      const review = action.request.data.trackReview.updateRating

      const track = state[review.track.id]
      if (track === undefined) {
        console.error(`could not find track id: ${review.track.id}`)
        return state
      }

      return {
        ...state,
        [track.id]: {
          ...track,
          // TODO: siteRating: review.release.siteRating ?? undefined,
        },
      }
    }

    default:
      return state
  }
}

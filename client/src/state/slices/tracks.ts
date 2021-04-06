import { GetTrackQuery, GraphqlError } from '../../generated/graphql'
import { gql } from '../../utils/gql'
import { HttpError } from '../../utils/http'
import {
  RemoteData,
  fromResult,
  isSuccess,
  loading,
} from '../../utils/remote-data'
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
  release: number
  genres: Set<number>
  siteRating?: number
  friendRating?: number
  similarUserRating?: number
  artists: Set<number>
  reviews: Set<number>
}

//
// Mappers
//

const mapTrack = (track: GetTrackQuery['track']['get']): Track => ({
  id: track.id,
  title: track.title,
  durationMs: track.durationMs ?? undefined,
  release: track.release.id,
  genres: ids(track.genres),
  siteRating: track.siteRating ?? undefined,
  friendRating: track.friendRating ?? undefined,
  similarUserRating: track.similarUserRating ?? undefined,
  artists: ids(track.artists),
  reviews: ids(track.reviews),
})

//
// Reducer
//

export const tracksReducer: Reducer<TracksState> = (state, action) => {
  if (state === undefined) {
    const initialState: TracksState = {}
    return initialState
  }

  switch (action._type) {
    case 'track/get': {
      if (!isSuccess(action.request)) return state
      const track = mapTrack(action.request.data.track.get)
      return { ...state, [track.id]: track }
    }

    case 'release/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.release.get
      const tracks: Track[] = response.tracks.map(mapTrack)

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

//
// Actions
//

export type TrackActions = GetTrackAction

export type GetTrackAction = {
  _type: 'track/get'
  request: RemoteData<HttpError | GraphqlError, GetTrackQuery>
}
export const getTrack = async function* (
  id: number
): AsyncGenerator<GetTrackAction> {
  yield {
    _type: 'track/get',
    request: loading,
  }

  const response = await gql.GetTrack({ id })
  yield { _type: 'track/get', request: fromResult(response) }
}

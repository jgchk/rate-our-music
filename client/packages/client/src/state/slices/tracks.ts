import {
  GetTrackQuery,
  TrackDataFragment,
  TrackGenreDataFragment,
} from '../../generated/graphql'
import { GraphqlRequestError, graphql } from '../../utils/graphql'
import {
  RemoteData,
  fromResult,
  isSuccess,
  loading,
} from '../../utils/remote-data'
import { ids, mergeIds } from '../../utils/state'
import { Reducer } from '../store'

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
  genres: Set<TrackGenre>
  siteRating?: number
  artists: Set<number>
  reviews: Set<number>
}

export type TrackGenre = {
  genreId: number
  weight: number
}

//
// Mappers
//

const mapGenres = (genres: TrackGenreDataFragment[]): Set<TrackGenre> =>
  new Set(
    genres.map((genre) => ({ genreId: genre.genre.id, weight: genre.weight }))
  )

const mapTrack = (track: TrackDataFragment): Track => ({
  id: track.id,
  title: track.title,
  durationMs: track.durationMs ?? undefined,
  release: track.release.id,
  genres: mapGenres(track.genres),
  siteRating: track.siteRating ?? undefined,
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

    case 'release/getFull': {
      if (!isSuccess(action.request)) return state
      const tracks = action.request.data.release.get.tracks.map(mapTrack)
      return mergeIds(state, tracks)
    }
    case 'release/add': {
      if (!isSuccess(action.request)) return state
      const tracks = action.request.data.releases.add.tracks.map(mapTrack)
      return mergeIds(state, tracks)
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
          siteRating: review.track.siteRating ?? undefined,
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
          siteRating: review.track.siteRating ?? undefined,
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
  request: RemoteData<GraphqlRequestError, GetTrackQuery>
}
export const getTrack = async function* (
  id: number
): AsyncGenerator<GetTrackAction> {
  yield {
    _type: 'track/get',
    request: loading,
  }

  const response = await graphql.getTrack({ id })
  yield { _type: 'track/get', request: fromResult(response) }
}

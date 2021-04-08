import { GetReleaseQuery, GraphqlError } from '../../../generated/graphql'
import { Reducer } from '../../common/state/store'
import { graphql } from '../../common/utils/graphql'
import { HttpError } from '../../common/utils/http'
import {
  RemoteData,
  fromResult,
  isSuccess,
  loading,
} from '../../common/utils/remote-data'
import { ids } from '../../common/utils/state'

//
// Types
//

export type ReleasesState = {
  [id: number]: Release
}

export type Release = {
  id: number
  title: string
  artists: Set<number>
  releaseDate?: PartialDate
  coverArt?: string
  tracks: Set<number>
  genres: Set<number>
  siteRating?: number
  friendRating?: number
  similarUserRating?: number
  reviews: Set<number>
}

export type PartialDate = {
  day: number | undefined
  month: number | undefined
  year: number
}

//
// Reducer
//

export const releasesReducer: Reducer<ReleasesState> = (state, action) => {
  if (state === undefined) {
    const initialState: ReleasesState = {}
    return initialState
  }

  switch (action._type) {
    case 'release/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.release.get

      const release: Release = {
        id: response.id,
        title: response.title,
        artists: ids(response.artists),
        releaseDate: response.releaseDate
          ? {
              day: response.releaseDate.day ?? undefined,
              month: response.releaseDate.month ?? undefined,
              year: response.releaseDate.year,
            }
          : undefined,
        coverArt: response.coverArt ?? undefined,
        tracks: ids(response.tracks),
        genres: ids(response.genres),
        siteRating: response.siteRating ?? undefined,
        friendRating: response.friendRating ?? undefined,
        similarUserRating: response.similarUserRating ?? undefined,
        reviews: ids(response.reviews),
      }
      return { ...state, [release.id]: release }
    }

    case 'review/release/create': {
      if (!isSuccess(action.request)) return state

      const review = action.request.data.releaseReview.create

      const release = state[review.release.id]
      if (release === undefined) {
        console.error(`could not find release id: ${review.release.id}`)
        return state
      }

      return {
        ...state,
        [release.id]: {
          ...release,
          reviews: release.reviews.add(review.id),
          siteRating: review.release.siteRating ?? undefined,
        },
      }
    }
    case 'review/release/update': {
      if (!isSuccess(action.request)) return state

      const review = action.request.data.releaseReview.updateRating

      const release = state[review.release.id]
      if (release === undefined) {
        console.error(`could not find release id: ${review.release.id}`)
        return state
      }

      return {
        ...state,
        [release.id]: {
          ...release,
          siteRating: review.release.siteRating ?? undefined,
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

export type ReleaseActions = GetReleaseAction

export type GetReleaseAction = {
  _type: 'release/get'
  request: RemoteData<HttpError | GraphqlError, GetReleaseQuery>
}
export const getRelease = async function* (
  id: number
): AsyncGenerator<GetReleaseAction> {
  yield {
    _type: 'release/get',
    request: loading,
  }

  const response = await graphql.GetRelease({ id })
  yield { _type: 'release/get', request: fromResult(response) }
}

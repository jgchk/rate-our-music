import { isLeft } from 'fp-ts/Either'
import { GetReleaseQuery, GraphqlError } from '../../generated/graphql'
import { gql } from '../../utils/gql'
import { HttpError } from '../../utils/http'
import {
  RemoteData,
  failure,
  isSuccess,
  loading,
  success,
} from '../../utils/remote-data'
import { Reducer } from '../store'
import { ids } from './utils'

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
  siteRating: number
  friendRating: number
  similarUserRating: number
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

      const response = action.request.data.release.getOne

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
        siteRating: response.siteRating,
        friendRating: response.friendRating,
        similarUserRating: response.similarUserRating,
        reviews: ids(response.reviews),
      }
      return { ...state, [release.id]: release }
    }

    case 'review/create': {
      if (!isSuccess(action.request)) return state

      const release = state[action.releaseId]
      if (release === undefined) {
        console.error(`could not find release id: ${action.releaseId}`)
        return state
      }

      const reviewId = action.request.data.releaseReview.create.id
      return {
        ...state,
        [release.id]: { ...release, reviews: release.reviews.add(reviewId) },
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

  const response = await gql.GetRelease({ id })()
  yield isLeft(response)
    ? {
        _type: 'release/get',
        request: failure(response.left),
      }
    : {
        _type: 'release/get',
        request: success(response.right),
      }
}

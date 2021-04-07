import {
  CreateTrackReviewMutation,
  GetTrackReviewQuery,
  GraphqlError,
  TrackReviewDataFragment,
  UpdateTrackReviewRatingMutation,
} from '../../generated/graphql'
import { gql } from '../../utils/gql'
import { HttpError } from '../../utils/http'
import {
  RemoteData,
  fromResult,
  isSuccess,
  loading,
} from '../../utils/remote-data'
import { Reducer } from '../store'
import { mergeIds } from './utils'

//
// Types
//

export type TrackReviewsState = {
  [id: number]: TrackReview
}

export type TrackReview = {
  id: number
  user: number
  rating?: number
  text?: string
}

//
// Mappers
//

const mapReview = (review: TrackReviewDataFragment): TrackReview => ({
  id: review.id,
  user: review.account.id,
  rating: review.rating ?? undefined,
  text: review.text ?? undefined,
})

//
// Reducer
//

export const trackReviewsReducer: Reducer<TrackReviewsState> = (
  state,
  action
) => {
  if (state === undefined) {
    const initialState: TrackReviewsState = {}
    return initialState
  }

  switch (action._type) {
    case 'review/track/create': {
      if (!isSuccess(action.request)) return state
      const review = mapReview(action.request.data.trackReview.create)
      return mergeIds(state, [review])
    }

    case 'review/track/get': {
      if (!isSuccess(action.request)) return state
      const review = mapReview(action.request.data.trackReview.get)
      return mergeIds(state, [review])
    }

    case 'review/track/update': {
      if (!isSuccess(action.request)) return state
      const review = mapReview(action.request.data.trackReview.updateRating)
      return mergeIds(state, [review])
    }

    case 'track/get': {
      if (!isSuccess(action.request)) return state
      const trackReviews = action.request.data.track.get.reviews.map(mapReview)
      return mergeIds(state, trackReviews)
    }

    case 'release/get': {
      if (!isSuccess(action.request)) return state
      const response = action.request.data.release.get
      const trackReviews = response.tracks
        .flatMap((track) => track.reviews)
        .map(mapReview)
      return mergeIds(state, trackReviews)
    }

    default:
      return state
  }
}

//
// Actions
//

export type TrackReviewActions =
  | CreateTrackReviewAction
  | GetTrackReviewAction
  | UpdateTrackReviewRatingAction

type TrackReviewInput = Omit<TrackReview, 'id' | 'user'>

export type CreateTrackReviewAction = {
  _type: 'review/track/create'
  request: RemoteData<HttpError | GraphqlError, CreateTrackReviewMutation>
  trackId: number
  review: TrackReviewInput
}
export const createTrackReview = async function* (
  trackId: number,
  userId: number,
  review: TrackReviewInput
): AsyncGenerator<CreateTrackReviewAction> {
  const base = {
    _type: 'review/track/create',
    trackId,
    review,
  } as const
  yield { ...base, request: loading }
  const response = await gql.CreateTrackReview({
    trackId,
    accountId: userId,
    ...review,
  })
  yield { ...base, request: fromResult(response) }
}

export type GetTrackReviewAction = {
  _type: 'review/track/get'
  request: RemoteData<HttpError | GraphqlError, GetTrackReviewQuery>
  trackId: number
}
export const getTrackReview = async function* (
  trackId: number
): AsyncGenerator<GetTrackReviewAction> {
  const base = { _type: 'review/track/get', trackId } as const
  yield { ...base, request: loading }
  const response = await gql.GetTrackReview({ id: trackId })
  yield { ...base, request: fromResult(response) }
}

export type UpdateTrackReviewRatingAction = {
  _type: 'review/track/update'
  request: RemoteData<HttpError | GraphqlError, UpdateTrackReviewRatingMutation>
  reviewId: number
  rating: number
}
export const updateTrackReviewRating = async function* (
  reviewId: number,
  rating: number
): AsyncGenerator<UpdateTrackReviewRatingAction> {
  const base = {
    _type: 'review/track/update',
    reviewId,
    rating,
  } as const
  yield { ...base, request: loading }
  const response = await gql.UpdateTrackReviewRating({
    reviewId,
    rating: rating > 0 ? rating : undefined,
  })
  yield { ...base, request: fromResult(response) }
}

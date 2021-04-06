import {
  CreateReleaseReviewMutation,
  CreateTrackReviewMutation,
  GetReleaseQuery,
  GetTrackQuery,
  GraphqlError,
  UpdateReleaseReviewRatingMutation,
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

export type ReviewsState = {
  release: { [id: number]: Review }
  track: { [id: number]: Review }
}

export type Review = {
  id: number
  user: number
  rating?: number
  text?: string
}

//
// Mappers
//

const mapReview = (
  review:
    | GetReleaseQuery['release']['get']['reviews'][number]
    | GetTrackQuery['track']['get']['reviews'][number]
): Review => ({
  id: review.id,
  user: review.account.id,
  rating: review.rating ?? undefined,
  text: review.text ?? undefined,
})

//
// Reducer
//

export const reviewsReducer: Reducer<ReviewsState> = (state, action) => {
  if (state === undefined) {
    const initialState: ReviewsState = { release: {}, track: {} }
    return initialState
  }

  switch (action._type) {
    case 'release/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.release.get
      const releaseReviews = response.reviews.map(mapReview)
      const trackReviews = response.tracks
        .flatMap((track) => track.reviews)
        .map(mapReview)
      return {
        ...state,
        release: mergeIds(state.release, releaseReviews),
        track: mergeIds(state.track, trackReviews),
      }
    }

    case 'track/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.track.get
      const trackReviews = response.reviews.map(mapReview)
      return { ...state, track: mergeIds(state.track, trackReviews) }
    }

    case 'review/release/create': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.releaseReview.create
      const review: Review = {
        id: response.id,
        user: response.account.id,
        rating: response.rating ?? undefined,
        text: response.text ?? undefined,
      }
      return { ...state, release: { ...state.release, [review.id]: review } }
    }

    case 'review/release/update': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.releaseReview.updateRating
      const review: Review = {
        id: response.id,
        user: response.account.id,
        rating: response.rating ?? undefined,
        text: response.text ?? undefined,
      }
      return { ...state, release: { ...state.release, [review.id]: review } }
    }

    case 'review/track/create': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.trackReview.create
      const review: Review = {
        id: response.id,
        user: response.account.id,
        rating: response.rating ?? undefined,
        text: response.text ?? undefined,
      }
      return { ...state, track: { ...state.track, [review.id]: review } }
    }

    case 'review/track/update': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.trackReview.updateRating
      const review: Review = {
        id: response.id,
        user: response.account.id,
        rating: response.rating ?? undefined,
        text: response.text ?? undefined,
      }
      return { ...state, track: { ...state.track, [review.id]: review } }
    }

    default:
      return state
  }
}

//
// Actions
//

export type ReviewActions =
  | CreateReleaseReviewAction
  | UpdateReleaseReviewRatingAction
  | CreateTrackReviewAction
  | UpdateTrackReviewRatingAction

type ReviewInput = Omit<Review, 'id' | 'user'>
export type CreateReleaseReviewAction = {
  _type: 'review/release/create'
  request: RemoteData<HttpError | GraphqlError, CreateReleaseReviewMutation>
  releaseId: number
  review: ReviewInput
}
export const createReleaseReview = async function* (
  releaseId: number,
  userId: number,
  review: ReviewInput
): AsyncGenerator<CreateReleaseReviewAction> {
  const base = {
    _type: 'review/release/create',
    releaseId,
    review,
  } as const
  yield {
    ...base,
    request: loading,
  }

  const response = await gql.CreateReleaseReview({
    releaseId,
    accountId: userId,
    ...review,
  })
  yield { ...base, request: fromResult(response) }
}

export type UpdateReleaseReviewRatingAction = {
  _type: 'review/release/update'
  request: RemoteData<
    HttpError | GraphqlError,
    UpdateReleaseReviewRatingMutation
  >
  reviewId: number
  rating: number
}
export type ReviewUpdate = Partial<ReviewInput>
export const updateReleaseReviewRating = async function* (
  reviewId: number,
  rating: number
): AsyncGenerator<UpdateReleaseReviewRatingAction> {
  const base = {
    _type: 'review/release/update',
    reviewId,
    rating,
  } as const
  yield {
    ...base,
    request: loading,
  }

  const response = await gql.UpdateReleaseReviewRating({
    reviewId,
    rating: rating > 0 ? rating : undefined,
  })
  yield { ...base, request: fromResult(response) }
}

export type CreateTrackReviewAction = {
  _type: 'review/track/create'
  request: RemoteData<HttpError | GraphqlError, CreateTrackReviewMutation>
  trackId: number
  review: ReviewInput
}
export const createTrackReview = async function* (
  trackId: number,
  userId: number,
  review: ReviewInput
): AsyncGenerator<CreateTrackReviewAction> {
  const base = {
    _type: 'review/track/create',
    trackId,
    review,
  } as const
  yield {
    ...base,
    request: loading,
  }

  const response = await gql.CreateTrackReview({
    trackId,
    accountId: userId,
    ...review,
  })
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
  yield {
    ...base,
    request: loading,
  }

  const response = await gql.UpdateTrackReviewRating({
    reviewId,
    rating: rating > 0 ? rating : undefined,
  })
  yield { ...base, request: fromResult(response) }
}

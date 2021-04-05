import {
  CreateReleaseReviewMutation,
  GraphqlError,
  UpdateReleaseReviewRatingMutation,
} from '../../generated/graphql'
import { gql } from '../../utils/gql'
import { HttpError } from '../../utils/http'
import {
  RemoteData,
  fromResult,
  isSuccess,
  loading,
} from '../../utils/remote-data'
import { isErr } from '../../utils/result'
import { Reducer } from '../store'

//
// Types
//

export type ReviewsState = {
  [id: number]: Review
}

export type Review = {
  id: number
  user: number
  rating?: number
  text?: string
}

//
// Reducer
//

export const reviewsReducer: Reducer<ReviewsState> = (state, action) => {
  if (state === undefined) {
    const initialState: ReviewsState = {}
    return initialState
  }

  switch (action._type) {
    case 'release/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.release.getOne
      const reviews: Review[] = [
        ...response.reviews,
        ...response.tracks.flatMap((track) => track.reviews),
      ].map((review) => ({
        id: review.id,
        user: review.account.id,
        rating: review.rating ?? undefined,
        text: review.text ?? undefined,
      }))

      let nextState = { ...state }
      for (const review of reviews) {
        nextState = {
          ...nextState,
          [review.id]: review,
        }
      }
      return nextState
    }

    case 'review/create': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.releaseReview.create
      const review: Review = {
        id: response.id,
        user: response.account.id,
        rating: response.rating ?? undefined,
        text: response.text ?? undefined,
      }
      return { ...state, [review.id]: review }
    }

    case 'review/update': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.releaseReview.updateRating
      const review: Review = {
        id: response.id,
        user: response.account.id,
        rating: response.rating ?? undefined,
        text: response.text ?? undefined,
      }
      return { ...state, [review.id]: review }
    }

    default:
      return state
  }
}

//
// Actions
//

export type ReviewActions = CreateReviewAction | UpdateReviewRatingAction

type ReviewInput = Omit<Review, 'id' | 'user'>
export type CreateReviewAction = {
  _type: 'review/create'
  request: RemoteData<HttpError | GraphqlError, CreateReleaseReviewMutation>
  releaseId: number
  trackId: number | undefined
  review: ReviewInput
}
export const createReview = async function* (
  releaseId: number,
  trackId: number | undefined,
  userId: number,
  review: ReviewInput
): AsyncGenerator<CreateReviewAction> {
  const base = {
    _type: 'review/create',
    releaseId,
    trackId,
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

export type UpdateReviewRatingAction = {
  _type: 'review/update'
  request: RemoteData<
    HttpError | GraphqlError,
    UpdateReleaseReviewRatingMutation
  >
  reviewId: number
  rating: number
}
export type ReviewUpdate = Partial<ReviewInput>
export const updateReview = async function* (
  reviewId: number,
  rating: number
): AsyncGenerator<UpdateReviewRatingAction> {
  const base = {
    _type: 'review/update',
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

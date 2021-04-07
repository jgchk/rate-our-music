import {
  CreateReleaseReviewMutation,
  GetReleaseReviewQuery,
  GraphqlError,
  ReleaseReviewDataFragment,
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
import { Reducer } from '../store'
import { mergeIds } from './utils'

//
// Types
//

export type ReleaseReviewsState = {
  [id: number]: ReleaseReview
}

export type ReleaseReview = {
  id: number
  user: number
  rating?: number
  text?: string
}

//
// Mappers
//

const mapReview = (review: ReleaseReviewDataFragment): ReleaseReview => ({
  id: review.id,
  user: review.account.id,
  rating: review.rating ?? undefined,
  text: review.text ?? undefined,
})

//
// Reducer
//

export const releaseReviewsReducer: Reducer<ReleaseReviewsState> = (
  state,
  action
) => {
  if (state === undefined) {
    const initialState: ReleaseReviewsState = {}
    return initialState
  }

  switch (action._type) {
    case 'review/release/create': {
      if (!isSuccess(action.request)) return state
      const review = mapReview(action.request.data.releaseReview.create)
      return mergeIds(state, [review])
    }

    case 'review/release/get': {
      if (!isSuccess(action.request)) return state
      const review = mapReview(action.request.data.releaseReview.get)
      return mergeIds(state, [review])
    }

    case 'review/release/update': {
      if (!isSuccess(action.request)) return state
      const review = mapReview(action.request.data.releaseReview.updateRating)
      return mergeIds(state, [review])
    }

    case 'release/get': {
      if (!isSuccess(action.request)) return state
      const releaseReviews = action.request.data.release.get.reviews.map(
        mapReview
      )
      return mergeIds(state, releaseReviews)
    }

    default:
      return state
  }
}

//
// Actions
//

export type ReleaseReviewActions =
  | CreateReleaseReviewAction
  | GetReleaseReviewAction
  | UpdateReleaseReviewRatingAction

type ReleaseReviewInput = Omit<ReleaseReview, 'id' | 'user'>

export type CreateReleaseReviewAction = {
  _type: 'review/release/create'
  request: RemoteData<HttpError | GraphqlError, CreateReleaseReviewMutation>
  releaseId: number
  review: ReleaseReviewInput
}
export const createReleaseReview = async function* (
  releaseId: number,
  userId: number,
  review: ReleaseReviewInput
): AsyncGenerator<CreateReleaseReviewAction> {
  const base = {
    _type: 'review/release/create',
    releaseId,
    review,
  } as const
  yield { ...base, request: loading }
  const response = await gql.CreateReleaseReview({
    releaseId,
    accountId: userId,
    ...review,
  })
  yield { ...base, request: fromResult(response) }
}

export type GetReleaseReviewAction = {
  _type: 'review/release/get'
  request: RemoteData<HttpError | GraphqlError, GetReleaseReviewQuery>
  reviewId: number
}
export const getReleaseReview = async function* (
  reviewId: number
): AsyncGenerator<GetReleaseReviewAction> {
  const base = { _type: 'review/release/get', reviewId } as const
  yield { ...base, request: loading }
  const response = await gql.GetReleaseReview({ id: reviewId })
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
export type ReviewUpdate = Partial<ReleaseReviewInput>
export const updateReleaseReviewRating = async function* (
  reviewId: number,
  rating: number
): AsyncGenerator<UpdateReleaseReviewRatingAction> {
  const base = {
    _type: 'review/release/update',
    reviewId,
    rating,
  } as const
  yield { ...base, request: loading }
  const response = await gql.UpdateReleaseReviewRating({
    reviewId,
    rating: rating > 0 ? rating : undefined,
  })
  yield { ...base, request: fromResult(response) }
}

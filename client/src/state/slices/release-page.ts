import { GraphqlError } from '../../generated/graphql'
import { HttpError } from '../../utils/http'
import {
  RemoteData,
  initial,
  isFailure,
  isLoading,
  isSuccess,
  loading,
  success,
} from '../../utils/remote-data'
import { timeout } from '../../utils/timeout'
import { Action, State } from '../store'
import { tempRelease } from '../temp'

//
// Types
//

export type ReleasePageState = {
  release: Release | undefined
  requests: {
    getRelease: RemoteData<HttpError | GraphqlError, Release>
    updateReview: RemoteData<HttpError | GraphqlError, Review>
  }
}

export type Release = {
  id: number
  title: string
  artists: Artist[]
  releaseDate?: PartialDate
  coverArt?: string
  tracks: Track[]
  genres: Genre[]
  siteRating: number
  friendRating: number
  similarUserRating: number
  userReview: UserReview
  reviews: Review[]
}

export type Artist = {
  id: number
  name: string
}

export type PartialDate = {
  day: number | undefined
  month: number | undefined
  year: number
}

export type Track = {
  id: number
  title: string
  durationMs: number | undefined
}

export type Genre = {
  id: number
  name: string
  weight: number
}

export type Review = {
  id: number
  user: {
    id: number
    username: string
  }
  rating: number | undefined
  text: string | undefined
}

export type UserReview = Omit<Review, 'user'> & { id: number | undefined }

//
// Reducer
//

export const initialReleaseState: ReleasePageState = {
  release: undefined,
  requests: {
    getRelease: initial,
    updateReview: initial,
  },
}

export const releaseReducer = (
  state: State,
  action: Action
): ReleasePageState => {
  switch (action._type) {
    case 'release/getRelease': {
      const newState: ReleasePageState = {
        ...state.releasePage,
        requests: {
          ...state.releasePage.requests,
          getRelease: action.request,
        },
      }

      if (isSuccess(action.request)) {
        newState.release = action.request.data
      }

      return newState
    }
    case 'release/updateReview': {
      const newState: ReleasePageState = {
        ...state.releasePage,
        requests: {
          ...state.releasePage.requests,
          updateReview: action.request,
        },
      }

      if (newState.release) {
        if (isLoading(action.request)) {
          newState.release.userReview = {
            ...newState.release.userReview,
            ...action.reviewUpdate,
          }
        } else if (isSuccess(action.request)) {
          newState.release.userReview = action.request.data
        } else if (isFailure(action.request)) {
          newState.release.userReview = action.oldReview
        }
      }

      return newState
    }
  }
}

//
// Actions
//

export type ReleaseActions = GetReleaseAction | UpdateReviewAction

export type GetReleaseAction = {
  _type: 'release/getRelease'
  request: RemoteData<HttpError | GraphqlError, Release>
}
export const getRelease = async function* (
  id: number
): AsyncGenerator<GetReleaseAction> {
  yield { _type: 'release/getRelease', request: loading }
  await timeout(1000)
  yield {
    _type: 'release/getRelease',
    request: success({ ...tempRelease, id }),
  }
}

export type UpdateReviewAction = {
  _type: 'release/updateReview'
  request: RemoteData<HttpError | GraphqlError, Review>
  reviewUpdate: ReviewUpdate
  oldReview: UserReview
}
type ReviewUpdate = Partial<Omit<UserReview, 'id'>>
export const updateReview = async function* (
  reviewUpdate: Partial<Omit<Review, 'id' | 'user'>>,
  oldReview: UserReview
): AsyncGenerator<UpdateReviewAction> {
  yield {
    _type: 'release/updateReview',
    request: loading,
    reviewUpdate,
    oldReview,
  }
  await timeout(1000)
  yield {
    _type: 'release/updateReview',
    request: success({ ...tempRelease.userReview, ...reviewUpdate }),
    reviewUpdate,
    oldReview,
  }
}

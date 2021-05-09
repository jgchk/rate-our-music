import {
  FullAccountDataFragment,
  GetFullUserQuery,
  GetPartialUserQuery,
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

export type UsersState = {
  [id: number]: PartialUser | FullUser
}

export type PartialUser = {
  id: number
  username: string
}
export type FullUser = PartialUser & {
  releaseReviews: Set<number>
  trackReviews: Set<number>
}

export const isFullUser = (user: PartialUser | FullUser): user is FullUser =>
  'releaseReviews' in user

//
// Mappers
//

const mapFullAccount = (account: FullAccountDataFragment): FullUser => ({
  id: account.id,
  username: account.username,
  releaseReviews: ids(account.releaseReviews),
  trackReviews: ids(account.trackReviews),
})

//
// Reducer
//

export const usersReducer: Reducer<UsersState> = (state, action) => {
  if (state === undefined) {
    const initialState: UsersState = {}
    return initialState
  }

  switch (action._type) {
    case 'user/getPartial': {
      if (!isSuccess(action.request)) return state
      const user = action.request.data.account.get
      return { ...state, [user.id]: { ...state[user.id], ...user } }
    }

    case 'user/getFull': {
      if (!isSuccess(action.request)) return state
      const user = action.request.data.account.get
      return {
        ...state,
        [user.id]: { ...state[user.id], ...mapFullAccount(user) },
      }
    }

    case 'auth/login': {
      if (!isSuccess(action.request)) return state
      const user = action.request.data.account.login.account
      return { ...state, [user.id]: { ...state[user.id], ...user } }
    }

    case 'release/getFull': {
      if (!isSuccess(action.request)) return state
      const response = action.request.data.release.get
      const users = response.reviews.map((review) => review.account)
      return mergeIds(state, users)
    }
    case 'release/add': {
      if (!isSuccess(action.request)) return state
      const response = action.request.data.releases.add
      const users = response.reviews.map((review) => review.account)
      return mergeIds(state, users)
    }

    case 'track/get': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.track.get
      const users = response.reviews.map((review) => ({
        ...state[review.account.id],
        ...review.account,
      }))
      return mergeIds(state, users)
    }

    case 'review/release/create': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.releaseReview.create
      const user = response.account
      return { ...state, [user.id]: { ...state[user.id], ...user } }
    }
    case 'review/release/update': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.releaseReview.updateRating
      const user = response.account
      return { ...state, [user.id]: { ...state[user.id], ...user } }
    }
    case 'review/track/create': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.trackReview.create
      const user = response.account
      return { ...state, [user.id]: { ...state[user.id], ...user } }
    }
    case 'review/track/update': {
      if (!isSuccess(action.request)) return state

      const response = action.request.data.trackReview.updateRating
      const user = response.account
      return { ...state, [user.id]: { ...state[user.id], ...user } }
    }

    default:
      return state
  }
}

//
// Actions
//

export type UserActions = GetPartialUserAction | GetFullUserAction

export type GetPartialUserAction = {
  _type: 'user/getPartial'
  request: RemoteData<GraphqlRequestError, GetPartialUserQuery>
}
export const getPartialUser = async function* (
  id: number
): AsyncGenerator<GetPartialUserAction> {
  const base = { _type: 'user/getPartial' } as const
  yield { ...base, request: loading }
  const response = await graphql.getPartialUser({ id })
  yield { ...base, request: fromResult(response) }
}

export type GetFullUserAction = {
  _type: 'user/getFull'
  request: RemoteData<GraphqlRequestError, GetFullUserQuery>
}
export const getFullUser = async function* (
  id: number
): AsyncGenerator<GetFullUserAction> {
  const base = { _type: 'user/getFull' } as const
  yield { ...base, request: loading }
  const response = await graphql.getFullUser({ id })
  yield { ...base, request: fromResult(response) }
}

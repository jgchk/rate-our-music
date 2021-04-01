import { GraphqlError } from '../generated/graphql'
import { HttpError } from '../utils/http'
import { RemoteData, initial, loading, success } from '../utils/remote-data'
import { Action, State } from './store'
import { tempRelease } from './temp'

//
// TYPES
//

export type ReleaseState = RemoteData<HttpError | GraphqlError, Release>

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
  userReview?: Review
  reviews: Review[]
}

export type Artist = {
  id: number
  name: string
}

export type PartialDate = {
  day?: number
  month?: number
  year: number
}

export type Track = {
  id: number
  title: string
  durationMs?: number
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
  rating?: number
  text?: string
}

//
// REDUCER
//

export const initialReleaseState = initial

export const releaseReducer = (state: State, action: Action): ReleaseState => {
  switch (action._type) {
    case 'release/get': {
      return action.payload
    }
  }
}

//
// Actions
//

export type ReleaseActions = GetReleaseAction

export type GetReleaseAction = {
  _type: 'release/get'
  payload: RemoteData<HttpError | GraphqlError, Release>
}
export const getRelease = function* (id: number): Generator<GetReleaseAction> {
  yield { _type: 'release/get', payload: loading }
  yield { _type: 'release/get', payload: success({ ...tempRelease, id }) }
}

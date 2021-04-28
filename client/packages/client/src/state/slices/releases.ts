import {
  FullReleaseDataFragment,
  GetFullReleaseQuery,
  PartialReleaseDataFragment,
  ReleaseGenreDataFragment,
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

export type ReleasesState = {
  [id: number]: PartialRelease | FullRelease
}

export type PartialRelease = {
  id: number
  title: string
  artists: Set<number>
  releaseDate?: PartialDate
  coverArt?: string
  genres: GenreMap
}

export type FullRelease = PartialRelease & {
  tracks: Set<number>
  siteRating?: number
  reviews: Set<number>
}

export type PartialDate = {
  day: number | undefined
  month: number | undefined
  year: number
}

export type GenreMap = { [id: number]: number }

export const isFullRelease = (
  release: PartialRelease | FullRelease
): release is FullRelease => 'tracks' in release

//
// Mappers
//

const mapGenres = (genres: ReleaseGenreDataFragment[]): GenreMap => {
  const genreMap: { [id: number]: number } = {}
  for (const genre of genres) {
    genreMap[genre.genre.id] = genre.weight
  }
  return genreMap
}

const mapPartialRelease = (
  release: PartialReleaseDataFragment
): PartialRelease => ({
  id: release.id,
  title: release.title,
  artists: ids(release.artists),
  releaseDate: release.releaseDate
    ? {
        day: release.releaseDate.day ?? undefined,
        month: release.releaseDate.month ?? undefined,
        year: release.releaseDate.year,
      }
    : undefined,
  coverArt: release.coverArt ?? undefined,
  genres: mapGenres(release.genres),
})

const mapFullRelease = (release: FullReleaseDataFragment): FullRelease => ({
  ...mapPartialRelease(release),
  tracks: ids(release.tracks),
  siteRating: release.siteRating ?? undefined,
  reviews: ids(release.reviews),
})

//
// Reducer
//

export const releasesReducer: Reducer<ReleasesState> = (state, action) => {
  if (state === undefined) {
    const initialState: ReleasesState = {}
    return initialState
  }

  switch (action._type) {
    case 'release/getFull': {
      if (!isSuccess(action.request)) return state
      const release = mapFullRelease(action.request.data.release.get)
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
          reviews: isFullRelease(release)
            ? release.reviews.add(review.id)
            : undefined,
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

    case 'user/getFull': {
      if (!isSuccess(action.request)) return state

      const reviews = action.request.data.account.get.releaseReviews.map(
        (review) => mapPartialRelease(review.release)
      )
      return mergeIds(state, reviews)
    }

    default:
      return state
  }
}

//
// Actions
//

export type ReleaseActions = GetFullReleaseAction

export type GetFullReleaseAction = {
  _type: 'release/getFull'
  request: RemoteData<GraphqlRequestError, GetFullReleaseQuery>
}
export const getFullRelease = async function* (
  id: number
): AsyncGenerator<GetFullReleaseAction> {
  yield {
    _type: 'release/getFull',
    request: loading,
  }

  const response = await graphql.getFullRelease({ id })
  yield { _type: 'release/getFull', request: fromResult(response) }
}

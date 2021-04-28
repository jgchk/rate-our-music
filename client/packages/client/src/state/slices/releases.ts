import {
  GetReleaseQuery,
  ReleaseDataFragment,
  ReleaseGenreDataFragment,
} from '../../generated/graphql'
import { GraphqlRequestError, graphql } from '../../utils/graphql'
import {
  RemoteData,
  fromResult,
  isSuccess,
  loading,
} from '../../utils/remote-data'
import { ids } from '../../utils/state'
import { Reducer } from '../store'

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
  genres: GenreMap
  siteRating?: number
  reviews: Set<number>
}

export type PartialDate = {
  day: number | undefined
  month: number | undefined
  year: number
}

export type GenreMap = { [id: number]: number }

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

const mapRelease = (release: ReleaseDataFragment): Release => ({
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
  tracks: ids(release.tracks),
  genres: mapGenres(release.genres),
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
    case 'release/get': {
      if (!isSuccess(action.request)) return state
      const release = mapRelease(action.request.data.release.get)
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
  request: RemoteData<GraphqlRequestError, GetReleaseQuery>
}
export const getRelease = async function* (
  id: number
): AsyncGenerator<GetReleaseAction> {
  yield {
    _type: 'release/get',
    request: loading,
  }

  const response = await graphql.getRelease({ id })
  yield { _type: 'release/get', request: fromResult(response) }
}

import { useMemo, useState } from 'preact/hooks'
import { getArtist, searchArtists } from '../state/slices/artists'
import { getAllGenres, getGenre } from '../state/slices/genres'
import { getReleaseReview } from '../state/slices/release-reviews'
import { getAllReleaseTypes } from '../state/slices/release-types'
import {
  addRelease,
  createReleaseGenreVote,
  getFullRelease,
} from '../state/slices/releases'
import { getTrackReview } from '../state/slices/track-reviews'
import { getTrack } from '../state/slices/tracks'
import { getFullUser, getPartialUser } from '../state/slices/users'
import {
  Action,
  ActionCreator,
  DispatchedAction,
  useDispatch,
  useSelector,
} from '../state/store'
import { flow } from '../utils/pipe'

export const useAction = <Args extends unknown[], Act extends Action>(
  actionCreator: ActionCreator<Args, Act>,
  _type: Act['_type']
): [(...args: Args) => void, DispatchedAction<Act> | undefined] => {
  // eslint-disable-next-line unicorn/no-useless-undefined
  const [actionId, setActionId] = useState<number | undefined>(undefined)
  const dispatch = useDispatch()

  const execute = useMemo(() => flow(actionCreator, dispatch, setActionId), [
    actionCreator,
    dispatch,
  ])

  const action = useSelector((state) => {
    if (actionId === undefined) return
    const action = state.actions[actionId]
    if (action?._type !== _type) return
    return action as DispatchedAction<Act>
  })

  return [execute, action]
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const useGetFullReleaseAction = () =>
  useAction(getFullRelease, 'release/getFull')
export const useAddReleaseAction = () => useAction(addRelease, 'release/add')
export const useCreateReleaseGenreVoteAction = () =>
  useAction(createReleaseGenreVote, 'release/genreVote/create')
export const useGetArtistAction = () => useAction(getArtist, 'artist/get')
export const useSearchArtistsAction = () =>
  useAction(searchArtists, 'artist/search')
export const useGetTrackAction = () => useAction(getTrack, 'track/get')
export const useGetGenreAction = () => useAction(getGenre, 'genre/get')
export const useGetAllGenresAction = () =>
  useAction(getAllGenres, 'genre/getAll')
export const useGetReleaseReviewAction = () =>
  useAction(getReleaseReview, 'review/release/get')
export const useGetTrackReviewAction = () =>
  useAction(getTrackReview, 'review/track/get')
export const useGetPartialUserAction = () =>
  useAction(getPartialUser, 'user/getPartial')
export const useGetFullUserAction = () => useAction(getFullUser, 'user/getFull')
export const useGetAllReleaseTypesAction = () =>
  useAction(getAllReleaseTypes, 'releaseType/getAll')
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

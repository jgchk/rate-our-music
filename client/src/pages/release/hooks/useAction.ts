import { useMemo, useState } from 'preact/hooks'
import { getArtist } from '../../../state/slices/artists'
import { login } from '../../../state/slices/auth'
import { getReleaseGenre, getTrackGenre } from '../../../state/slices/genres'
import { getReleaseReview } from '../../../state/slices/release-reviews'
import { getRelease } from '../../../state/slices/releases'
import { getTrackReview } from '../../../state/slices/track-reviews'
import { getTrack } from '../../../state/slices/tracks'
import {
  ActionCreator,
  DispatchedAction,
  RawAction,
  useDispatch,
  useSelector,
} from '../../../state/store'
import { flow } from '../../../utils/pipe'

export const useAction = <Args extends unknown[], Act extends RawAction>(
  actionCreator: ActionCreator<Args, Act>,
  _type: Act['_type']
): [(...args: Args) => void, DispatchedAction<Act> | undefined] => {
  const dispatch = useDispatch()
  const [actionId, setActionId] = useState<number | undefined>(undefined)

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
export const useLoginAction = () => useAction(login, 'auth/login')
export const useGetReleaseAction = () => useAction(getRelease, 'release/get')
export const useGetArtistAction = () => useAction(getArtist, 'artist/get')
export const useGetTrackAction = () => useAction(getTrack, 'track/get')
export const useGetReleaseGenreAction = () =>
  useAction(getReleaseGenre, 'genre/release/get')
export const useGetTrackGenreAction = () =>
  useAction(getTrackGenre, 'genre/track/get')
export const useGetReleaseReviewAction = () =>
  useAction(getReleaseReview, 'review/release/get')
export const useGetTrackReviewAction = () =>
  useAction(getTrackReview, 'review/track/get')
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

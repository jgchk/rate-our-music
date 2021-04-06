import { useCallback, useState } from 'preact/hooks'
import { GetTrackAction, getTrack } from '../../../state/slices/tracks'
import { useDispatch, useSelector } from '../../../state/store'

export const useGetTrackAction = (): [
  (trackId: number) => void,
  GetTrackAction | undefined
] => {
  const dispatch = useDispatch()
  const [actionId, setActionId] = useState<number | undefined>(undefined)

  const execute = useCallback(
    (trackId: number) => setActionId(dispatch(getTrack(trackId))),
    [dispatch]
  )

  const action = useSelector((state) => {
    if (actionId === undefined) return undefined
    const action = state.actions[actionId]
    if (action?._type !== 'track/get') return undefined
    return action
  })

  return [execute, action]
}

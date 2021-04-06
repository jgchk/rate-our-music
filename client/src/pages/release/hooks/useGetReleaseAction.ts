import { useCallback, useState } from 'preact/hooks'
import { GetReleaseAction, getRelease } from '../../../state/slices/releases'
import { useDispatch, useSelector } from '../../../state/store'

export const useGetReleaseAction = (): [
  (releaseId: number) => void,
  GetReleaseAction | undefined
] => {
  const dispatch = useDispatch()
  const [actionId, setActionId] = useState<number | undefined>(undefined)

  const execute = useCallback(
    (releaseId: number) => setActionId(dispatch(getRelease(releaseId))),
    [dispatch]
  )

  const action = useSelector((state) => {
    if (actionId === undefined) return undefined
    const action = state.actions[actionId]
    if (action?._type !== 'release/get') return undefined
    return action
  })

  return [execute, action]
}

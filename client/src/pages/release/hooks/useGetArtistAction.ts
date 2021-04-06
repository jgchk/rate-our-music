import { useCallback, useState } from 'preact/hooks'
import { GetArtistAction, getArtist } from '../../../state/slices/artists'
import { useDispatch, useSelector } from '../../../state/store'

export const useGetArtistAction = (): [
  (releaseId: number) => void,
  GetArtistAction | undefined
] => {
  const dispatch = useDispatch()
  const [actionId, setActionId] = useState<number | undefined>(undefined)

  const execute = useCallback(
    (id: number) => setActionId(dispatch(getArtist(id))),
    [dispatch]
  )

  const action = useSelector((state) => {
    if (actionId === undefined) return undefined
    const action = state.actions[actionId]
    if (action?._type !== 'artist/get') return undefined
    return action
  })

  return [execute, action]
}

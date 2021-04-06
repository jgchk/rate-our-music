import { useCallback, useState } from 'preact/hooks'
import { LoginAction, login } from '../../../state/slices/auth'
import { useDispatch, useSelector } from '../../../state/store'

export const useLoginAction = (): [
  (username: string, password: string) => void,
  LoginAction | undefined
] => {
  const dispatch = useDispatch()
  const [actionId, setActionId] = useState<number | undefined>(undefined)

  const execute = useCallback(
    (username: string, password: string) =>
      setActionId(dispatch(login(username, password))),
    [dispatch]
  )

  const action = useSelector((state) => {
    if (actionId === undefined) return undefined
    const action = state.actions[actionId]
    if (action?._type !== 'auth/login') return undefined
    return action
  })

  return [execute, action]
}

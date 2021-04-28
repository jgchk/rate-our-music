import { FunctionComponent, h } from 'preact'
import { useContext, useEffect, useMemo } from 'preact/hooks'
import { useSelector } from '../../common/state/store'
import { isFailure, isLoading } from '../../common/utils/remote-data'
import { RouterContext } from '../../routing/contexts/RouterContext'
import { useLogoutAction } from '../hooks/useAuthAction'

export const LogoutPage: FunctionComponent = () => {
  const [logout, logoutAction] = useLogoutAction()

  const token = useSelector((state) => state.auth.auth?.token)
  const { push } = useContext(RouterContext)
  useEffect(() => {
    if (token !== undefined) {
      logout(token)
    } else {
      // logged out
      push('/')
    }
  }, [logout, push, token])

  const logoutError = useMemo(() => {
    if (!logoutAction) return
    if (!isFailure(logoutAction.request)) return
    const error = logoutAction.request.error
    if (error.name === 'HttpError')
      return 'Logout request failed. Try again in a few minutes.'
    if (error.name === 'GraphqlError') {
      return 'Logout request failed.'
    }
  }, [logoutAction])

  return (
    <div>
      {logoutAction && isLoading(logoutAction.request) && 'Logging out...'}
      {logoutError}
    </div>
  )
}

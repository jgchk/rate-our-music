import { FunctionComponent, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { useLogoutMutation } from '../generated/graphql'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useRouterContext } from '../router/useRouterContext'

export const LogoutPage: FunctionComponent = () => {
  const [{ data, fetching, error }, logout] = useLogoutMutation()

  useEffect(() => {
    void logout()
  }, [logout])

  const removeToken = useLocalStorage<string | undefined>('token', undefined)[2]
  const removeRefreshToken = useLocalStorage<string | undefined>(
    'refreshToken',
    undefined
  )[2]
  const { push } = useRouterContext()
  useEffect(() => {
    if (data) {
      removeToken()
      removeRefreshToken()
      push('/')
    }
  }, [data, push, removeRefreshToken, removeToken])

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div />
}

import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'
import { useLoginAction } from '../hooks/useAuthAction'
import { useRouterContext } from '../router/useRouterContext'
import { useSelector } from '../state/store'
import { isFailure, isLoading } from '../utils/remote-data'

export const LoginPage: FunctionComponent = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, loginAction] = useLoginAction()

  const onSubmit = () => {
    console.log({ username, password })
    login(username, password)
  }

  const isLoggedIn = useSelector((state) => state.auth.auth !== undefined)
  const { push } = useRouterContext()
  useEffect(() => {
    if (isLoggedIn) push('/')
  }, [isLoggedIn, push])

  const loginError = useMemo(() => {
    if (!loginAction) return
    if (!isFailure(loginAction.request)) return
    const error = loginAction.request.error
    if (error.name === 'HttpError')
      return 'Login request failed. Try again in a few minutes.'
    if (error.name === 'GraphqlError') {
      if (error.errors.some((error) => error.message === 'invalid credentials'))
        return 'Invalid credentials'
      return 'Login request failed.'
    }
  }, [loginAction])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <label htmlFor='username'>
          Username
          <input
            type='text'
            name='username'
            id='username'
            onInput={(e) => setUsername(e.currentTarget.value)}
          />
        </label>
        <label htmlFor='password'>
          Password
          <input
            type='password'
            name='password'
            id='password'
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </label>
        <button type='submit'>Login</button>
      </form>
      {loginAction && isLoading(loginAction.request) && 'Loading...'}
      {loginError}
    </div>
  )
}
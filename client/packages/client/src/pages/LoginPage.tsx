import { FunctionComponent, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { useLoginMutation } from '../generated/graphql'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useRouterContext } from '../router/useRouterContext'

export const LoginPage: FunctionComponent = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [{ data, fetching, error }, login] = useLoginMutation()

  const onSubmit = () => {
    void login({ username, password })
  }

  const { push } = useRouterContext()
  const [, setToken] = useLocalStorage<string | undefined>('token', undefined)
  const [, setRefreshToken] = useLocalStorage<string | undefined>(
    'refreshToken',
    undefined
  )
  useEffect(() => {
    if (data) {
      setToken(data.account.login.token)
      setRefreshToken(data.account.login.refreshToken)
      push('/')
    }
  }, [data, push, setRefreshToken, setToken])

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
      {fetching && 'Loading...'}
      {error && <div>Error: {error.message}</div>}
    </div>
  )
}

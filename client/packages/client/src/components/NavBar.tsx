import { Fragment, FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { build } from '../router/parser'
import { loginRoute, logoutRoute } from '../router/routes'
import { Auth } from '../state/slices/auth'
import { useSelector } from '../state/store'
import { Link } from './Link'
import { UserLink } from './UserLink'

const LoggedIn: FunctionComponent<{ auth: Auth }> = ({ auth }) => {
  const logoutLink = useMemo(() => build(logoutRoute)({}), [])
  return (
    <>
      <UserLink id={auth.user} />
      <Link href={logoutLink}>logout</Link>
    </>
  )
}

export const NavBar: FunctionComponent = () => {
  const auth = useSelector((state) => state.auth.auth)

  const loginLink = useMemo(() => build(loginRoute)({}), [])

  return (
    <div className='flex justify-center w-full'>
      <div className='w-full max-w-screen-2xl p-4 flex justify-between'>
        <div>rate our music</div>
        <div className='flex gap-1'>
          {auth !== undefined ? (
            <LoggedIn auth={auth} />
          ) : (
            <Link href={loginLink}>login</Link>
          )}
        </div>
      </div>
    </div>
  )
}

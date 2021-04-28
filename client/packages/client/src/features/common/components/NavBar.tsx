import { Fragment, FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { Auth } from '../../auth/state/auth'
import { UserLink } from '../../release/components/UserLink'
import { loginRoute, logoutRoute } from '../../routing/routes'
import { build } from '../../routing/utils/parser'
import { useSelector } from '../state/store'
import { Link } from './Link'

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

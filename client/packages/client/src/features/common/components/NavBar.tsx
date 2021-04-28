import { FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { loginRoute, logoutRoute } from '../../routing/routes'
import { build } from '../../routing/utils/parser'
import { useSelector } from '../state/store'
import { Link } from './Link'

export const NavBar: FunctionComponent = () => {
  const isLoggedIn = useSelector((state) => state.auth.auth !== undefined)

  const logoutLink = useMemo(() => build(logoutRoute)({}), [])
  const loginLink = useMemo(() => build(loginRoute)({}), [])

  return (
    <div className='flex justify-center w-full'>
      <div className='w-full max-w-screen-2xl p-4 flex justify-between'>
        <div>rate our music</div>
        <div className='flex'>
          {isLoggedIn ? (
            <Link href={logoutLink}>logout</Link>
          ) : (
            <Link href={loginLink}>login</Link>
          )}
        </div>
      </div>
    </div>
  )
}

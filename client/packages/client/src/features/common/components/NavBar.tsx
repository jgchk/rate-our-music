import { FunctionComponent, h } from 'preact'
import { useSelector } from '../state/store'
import { Link } from './Link'

export const NavBar: FunctionComponent = () => {
  const isLoggedIn = useSelector((state) => state.auth.auth !== undefined)

  return (
    <div className='flex justify-center w-full'>
      <div className='w-full max-w-screen-2xl p-4 flex justify-between'>
        <div>rate our music</div>
        <div className='flex'>
          {isLoggedIn ? (
            <Link href='/logout'>logout</Link>
          ) : (
            <Link href='/login'>login</Link>
          )}
        </div>
      </div>
    </div>
  )
}

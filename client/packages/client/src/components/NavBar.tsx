import { Fragment, FunctionComponent, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { useWhoAmIQuery } from '../generated/graphql'
import { build } from '../router/parser'
import { addReleaseRoute, loginRoute, logoutRoute } from '../router/routes'
import { Link } from './Link'
import { UserLink } from './UserLink'

const LoggedIn: FunctionComponent<{ userId: number }> = ({ userId }) => {
  const logoutLink = useMemo(() => build(logoutRoute)({}), [])
  const addReleaseLink = useMemo(() => build(addReleaseRoute)({}), [])
  return (
    <>
      <Link href={addReleaseLink}>+</Link>
      <UserLink id={userId} />
      <Link href={logoutLink}>logout</Link>
    </>
  )
}

export const NavBar: FunctionComponent = () => {
  const [{ data }] = useWhoAmIQuery()
  const account = useMemo(() => data?.account.whoami, [data?.account.whoami])
  const loginLink = useMemo(() => build(loginRoute)({}), [])

  return (
    <div className='flex justify-center w-full'>
      <div className='w-full max-w-screen-2xl p-4 flex justify-between'>
        <div>rate our music</div>
        <div className='flex gap-1'>
          {account !== undefined ? (
            <LoggedIn userId={account.id} />
          ) : (
            <Link href={loginLink}>login</Link>
          )}
        </div>
      </div>
    </div>
  )
}

import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import { useGetUserAction } from '../hooks/useAction'
import { build } from '../router/parser'
import { userRoute } from '../router/routes'
import { useSelector } from '../state/store'
import { isLoading } from '../utils/remote-data'
import { Link } from './Link'

export type Props = { id: number }

export const UserLink: FunctionComponent<Props> = ({ id }) => {
  const user = useSelector((state) => state.users[id])

  const [getUser, getUserAction] = useGetUserAction()
  useEffect(() => {
    if (user === undefined || user.id !== id) {
      getUser(id)
    }
  }, [getUser, id, user])

  const userLink = useMemo(() => build(userRoute)({ userId: id }), [id])

  if (getUserAction && isLoading(getUserAction.request)) {
    return <div>Loading...</div>
  }
  if (!user) {
    console.log({ getUserAction })
    return <div>No user found with id: {id}</div>
  }

  return <Link href={userLink}>{user.username}</Link>
}

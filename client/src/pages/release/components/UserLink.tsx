import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import { useSelector } from '../../../state/store'
import { isLoading } from '../../../utils/remote-data'
import { Link } from '../../common/components/Link'
import { useGetUserAction } from '../hooks/useAction'

export type Props = { id: number }

export const UserLink: FunctionComponent<Props> = ({ id }) => {
  const user = useSelector((state) => state.users[id])

  const [getUser, getUserAction] = useGetUserAction()
  useEffect(() => {
    if (user === undefined || user.id !== id) {
      getUser(id)
    }
  }, [getUser, id, user])

  if (getUserAction && isLoading(getUserAction.request)) {
    return <div>Loading...</div>
  }
  if (!user) return <div>No user found with id: {id}</div>

  return <Link href={`/user/${user.id}`}>{user.username}</Link>
}

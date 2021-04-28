import { FunctionComponent, h } from 'preact'
import { useEffect, useMemo } from 'preact/hooks'
import { useGetPartialUserAction } from '../hooks/useAction'
import { build } from '../router/parser'
import { userRoute } from '../router/routes'
import { useSelector } from '../state/store'
import { isLoading } from '../utils/remote-data'
import { Link } from './Link'

export type Props = { id: number }

export const UserLink: FunctionComponent<Props> = ({ id }) => {
  const user = useSelector((state) => state.users[id])

  const [getPartialUser, getPartialUserAction] = useGetPartialUserAction()
  useEffect(() => {
    if (user === undefined || user.id !== id) {
      getPartialUser(id)
    }
  }, [getPartialUser, id, user])

  const userLink = useMemo(() => build(userRoute)({ userId: id }), [id])

  if (getPartialUserAction && isLoading(getPartialUserAction.request)) {
    return <div>Loading...</div>
  }
  if (!user) {
    return <div>No user found with id: {id}</div>
  }

  return <Link href={userLink}>{user.username}</Link>
}
